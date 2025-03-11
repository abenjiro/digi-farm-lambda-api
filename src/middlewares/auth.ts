import { APIGatewayEvent } from 'aws-lambda';
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

const ssm = new SSMClient();
let CACHE_KEY: any;


const getApiKeyFromParameterStore = async (parameterName: string): Promise<string> => {

  if (CACHE_KEY != null) {
    console.log('Getting key from cache', CACHE_KEY);
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

export const authorize = async (event: APIGatewayEvent) => {
  try {
    const parameterName = process.env.JWT_SECRET || '';

    // Fetch the API key from the Parameter Store
    const SECRET_KEY = await getApiKeyFromParameterStore(parameterName);

    const token = event.headers.Authorization || event.headers.authorization;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized: No token provided" }),
      };
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach user data to request
    (event as any).user = decoded;

    return null; // No error, user is authenticated

  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized: Invalid token" }),
    };
  }
};
