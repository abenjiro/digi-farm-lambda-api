import { APIGatewayEvent, Context } from "aws-lambda";
import { Routes } from "../helpers/types.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpRouterHandler from "@middy/http-router";
import { FarmerService } from "../services/farmer.service.js";

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

    } catch (error : any) {
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
    // {
    //     method: "POST",
    //     path: "/farmers",
    //     handler: createFarmers,
    // },
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
