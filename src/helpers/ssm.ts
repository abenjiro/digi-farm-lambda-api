import AWS from 'aws-sdk';

const ssm = new AWS.SSM({
  apiVersion: 'latest',
  region: 'eu-west-1',
});


export const getValueOfParameter = async (parameterName: string): Promise<string> => {
    const params = {
      Name: parameterName,
      WithDecryption: true, // Ensures sensitive values are decrypted
    };
  
    try {
      const response = await ssm.getParameter(params).promise();
      return response.Parameter?.Value || '';
    } catch (error) {
      console.error('Error fetching value from Parameter Store:', error);
      throw new Error('Failed to fetch value from Parameter Store.');
    }
};


