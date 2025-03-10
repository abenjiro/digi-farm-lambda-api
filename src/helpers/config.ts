import { GetParameterCommand, SSMClient} from '@aws-sdk/client-ssm';
import dotenv from 'dotenv';
dotenv.config();


export interface ConfigParameters{
    database:{
        host:string,
        database:string,
        user:string,
        password:string
    }
}


const REGION = process.env.REGION;

let CACHE_CONFIG:any;
let CONFIG_PARAMS:any;//ConfigParameters;
const ssmClient = new SSMClient({region:REGION});



export async function getAppParameter(name: string ):Promise<string>{
    console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV == 'local'){
      console.log('Getting Applicantion configurations');
      return process.env.CONFIG || '';
    }
  
    if(CACHE_CONFIG != null){
      console.log('Getting Applicantion configurations from cache',CACHE_CONFIG);
      return CACHE_CONFIG;
    }
    
      try {
        console.log(`Getting applications configurations from parameters store. with key ${name}`);
        const command = new GetParameterCommand({
          Name: name,
          WithDecryption: true,
        });
      
        const result = await ssmClient.send(command);
        const value:any = result.Parameter?.Value;
        CACHE_CONFIG = value;
        return value;
      } catch (error) {
        console.error(`Error fetching parameter ${name}:`, error);
        throw error;
      }
}

  
// 🔹 Fetch Configurations & Handle JSON Parsing
async function loadConfiguration() {
  try {
    const configuration = await getAppParameter(process.env.APP_CONFIG_PARAMS ?? '');

    console.log("Raw Configuration:", configuration); // Debugging log

    if (!configuration) {
      throw new Error("Configuration is empty or invalid.");
    }

    CONFIG_PARAMS = JSON.parse(configuration) as ConfigParameters;
    console.log("Parsed Configurations:", CONFIG_PARAMS);
  } catch (error) {
    console.error("Failed to load configuration:", error);
    CONFIG_PARAMS = null;
  }
}

// configuration loading at startup
await loadConfiguration();

export {CONFIG_PARAMS};