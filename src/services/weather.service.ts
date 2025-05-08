import Farmer from "../models/farmer.model.js";
import { CONFIG_PARAMS } from "../helpers/config.js";

const env = CONFIG_PARAMS.farm_env;


export class WeatherService {

    async GetLocationWeather(user_id: any) {

        let getFarmerLocation  = await Farmer.findOne({where: {user_id: user_id} });

        if (!getFarmerLocation) {
           return {"responseCode": "404","responseMessage":"Farmer not found"}; 
        }

        // farm digital location from db
        let location = getFarmerLocation.digital_location;

        if (!location) {
            return {"responseCode": "404","responseMessage":"Farmer has no digial location"}; 
        }
        let [latitude, longitude] = location?.slice(1, -1).split(",") || ["0", "0"];
        
        const apiKey = env.weather_api_key;
        // Specify the API 
        const apiUrl = env.weather_api_url + `/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        const weatherInfo = await this.fetchCurrentWeather(apiUrl);

        return {
            responseCode: 200,
            responseMessage: "Weather fetched successfully",
            data: weatherInfo
        };

    }



    async fetchCurrentWeather(url:string) {
        try {
    
            const weatherData = await fetch(url);
                if (!weatherData.ok) {
                    throw new Error("could not fetch weather");
                }
    
                const data = await weatherData.json();
                console.log(data)
            
        } catch (error) {
            console.error("Error fetching current weather:", error);
            throw error;
        }
    }

}