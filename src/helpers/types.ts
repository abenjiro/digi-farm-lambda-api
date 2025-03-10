import {
    ALBResult, APIGatewayProxyResult, APIGatewayProxyResultV2, Handler as LambdaHandler
} from "aws-lambda"

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'ANY'
type TResult = ALBResult | APIGatewayProxyResult | APIGatewayProxyResultV2


export interface Routes<TEvent> {
    method: Method
    path: string
    handler: LambdaHandler<TEvent, TResult>
}

// Function to validate request body  
export const validateRequestBody = (
    body: any,
    fieldConfig: Record<string, string>
): { valid: boolean; message?: string } => {
    if (!body) return { valid: false, message: "Request body is missing" };

    for (const [field, type] of Object.entries(fieldConfig)) {
        if (!(field in body)) {
            return { valid: false, message: `Missing required field: ${field}` };
        }

        const value = body[field];

        switch (type) {
            case "string":
                if (typeof value !== "string" || value.trim() === "") {
                    return { valid: false, message: `Invalid value for ${field}, must be a non-empty string` };
                }
                break;

            case "uuid":
                if (typeof value !== "string" || !isValidUUID(value)) {
                    return { valid: false, message: `Invalid value for ${field}, must be a valid UUID` };
                }
                break;

            case "number":
                if (typeof value !== "number" || isNaN(value) || value <= 0) {
                    return { valid: false, message: `Invalid value for ${field}, must be a positive number` };
                }
                break;

            case "boolean":
                if (typeof value !== "boolean") {
                    return { valid: false, message: `Invalid value for ${field}, must be true or false` };
                }
                break;

            case "array":
                if (!Array.isArray(value)) {
                    return { valid: false, message: `Invalid value for ${field}, must be an array` };
                }
                break;

            case "object":
                if (typeof value !== "object" || value === null || Array.isArray(value)) {
                    return { valid: false, message: `Invalid value for ${field}, must be an object` };
                }
                break;

            case "any":
                // Accepts any value, no validation needed
                break;

            default:
                return { valid: false, message: `Unknown validation type for ${field}` };
        }
    }

    return { valid: true };
};

// Function to check if a string is a valid UUID
const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
