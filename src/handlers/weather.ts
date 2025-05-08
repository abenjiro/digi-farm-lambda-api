import { APIGatewayEvent, Context } from "aws-lambda";
import { Routes, WeatherInterface } from "../helpers/types";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpRouterHandler from "@middy/http-router";
import { WeatherService } from "../services/weather.service";


const farmLocationWeather = async (event: APIGatewayEvent, context: Context) => {
    try {

        // Extract and validate queryStringParameters
        const { user_id } =
            event.queryStringParameters || {};

        if (
            !user_id
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing or invalid query string parameters",
                }),
            };
        }

        // Prepare the request data using the interface
      const params: WeatherInterface = {
        user_id: parseInt(user_id, 10), // Ensure it's a number
      };
  
        const weather = new WeatherService();

        let response = await weather.GetLocationWeather(params);

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };


    } catch (error: any) {
        console.error("Error fetching weather:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "An error fetching weather", error: error.message }),
        };
    }

}




const getFarmWeather = middy().handler(farmLocationWeather);

const routes: Routes<APIGatewayEvent>[] = [
    {
        method: "GET",
        path: "/weather/{digital_location}",
        handler: getFarmWeather,
    }

];



export const handler = middy()
    .use(jsonBodyParser({ disableContentTypeError: true }))
    .use(httpHeaderNormalizer())
    .handler(httpRouterHandler(routes));