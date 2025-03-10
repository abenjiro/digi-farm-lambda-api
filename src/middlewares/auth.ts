import { APIGatewayEvent } from 'aws-lambda';
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import dotenv from 'dotenv';
dotenv.config();

const ssm = new SSMClient();
let CACHE_KEY:any;


const getApiKeyFromParameterStore = async (parameterName: string): Promise<string> => {

    if(CACHE_KEY != null){
      console.log('Getting API key from cache',CACHE_KEY);
      return CACHE_KEY;
    }

    const command = new GetParameterCommand({
        Name: parameterName,
        WithDecryption: true,
    });
  
    try {
      const response = await ssm.send(command);
      CACHE_KEY = response.Parameter?.Value;
      return response.Parameter?.Value || '';
    } catch (error) {
      console.error('Error fetching API key from Parameter Store:', error);
      throw new Error('Failed to fetch API key from Parameter Store.');
    }
  };

export const authorize = async (event: APIGatewayEvent): Promise<void> => {

    const parameterName = process.env.API_KEY || ''; 

    // Fetch the API key from the Parameter Store
    const VALID_API_KEY = await getApiKeyFromParameterStore(parameterName);


  // Extract the API key from headers
  const apiKey = event.headers['x-api-key'];

  if (!apiKey || apiKey !== VALID_API_KEY) {
    console.error('Unauthorized access. Invalid or missing API key.');
    throw {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Unauthorized access. Invalid or missing API key.',
      }),
    };
  }

  console.log('API Key validation successful.');
};
