import { APIGatewayEvent, Context } from "aws-lambda";
import { Routes, validateRequestBody } from "../helpers/types.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpRouterHandler from "@middy/http-router";
import { FarmerService } from "../services/farmer.service.js";



// create a new user with farm data
const createUserAndFarmer = async (event: APIGatewayEvent, context: Context) => {
  try {

    // Authorize the request using middleware
    //  await authorize(event);

    // Required fields for user validation
    const REQUIRED_FIELDS = {
      username: "string",
      password: "string",
      email: "string",
      first_name: "string",
      last_name: "string",
      phone_number: "string",
      location: "string",
      farm_size: "string"
    };

    // Ensure event body exists
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const requestBody: any = event.body;

    // Validate request data
    const validation = validateRequestBody(requestBody, REQUIRED_FIELDS);
    if (!validation.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: validation.message }),
      };
    }
     const userFarmer = new FarmerService;
     let response = await userFarmer.createUser(requestBody);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (error: any) {
    console.error("Error creating user and farmer:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating farmer",
        error: error.message,
      }),
    };
  }
};

//login user 
const loginUser = async (event: APIGatewayEvent, context: Context) => {
  try {

    // Authorize the request using middleware
    //  await authorize(event);

    // Required fields for user validation
    const REQUIRED_FIELDS = {
      password: "string",
      email: "string",
    };

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const requestBody = JSON.parse(event.body);

    // Validate request data
    const validation = validateRequestBody(requestBody, REQUIRED_FIELDS);
    if (!validation.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: validation.message }),
      };
    }

    const loginUsr = new FarmerService;
    let response = await loginUsr.login(requestBody);


    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred during login", error: error.message }),
    };
  }
};

// get one farmer
const fetchOneFarmer = async (event: APIGatewayEvent, context: Context) => {

  try {

    const id = event.pathParameters?.id
      ? parseInt(event.pathParameters.id, 10)
      : null;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing or invalid path parameters" }),
      };
    }

    let params = {
      id
    };

    let farmer = new FarmerService();
    let response = await farmer.getOneFarmer(params);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (error: any) {
    console.error("Error in student request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while processing the request",
        error: error.message,
      }),
    };
  }

}

//get all farmers
const fetchAllFarmers = async (event: APIGatewayEvent, context: Context) => {

}


const createUserFarmer = middy().handler(createUserAndFarmer);
const loginFarmer = middy().handler(loginUser);
const getSingleFarmer = middy().handler(fetchOneFarmer);
const getAllFarmers = middy().handler(fetchAllFarmers);

const routes: Routes<APIGatewayEvent>[] = [
  {
    method: "GET",
    path: "/farmers/{id}",
    handler: getSingleFarmer,
  },
  {
    method: "GET",
    path: "/farmers",
    handler: getAllFarmers,
  },
  {
    method: "POST",
    path: "/farmers",
    handler: createUserFarmer,
  },
  {
    method: "POST",
    path: "/login",
    handler: loginFarmer,
  },
  // {
  //     method: "DELETE",
  //     path: "/farmers/{id}",
  //     handler: deleteFarmers,
  // },
  // {
  //     method: "PUT",
  //     path: "/farmers",
  //     handler: updateFarmers,
  // },

];

export const handler = middy()
  .use(jsonBodyParser({ disableContentTypeError: true }))
  .use(httpHeaderNormalizer())
  .handler(httpRouterHandler(routes));
