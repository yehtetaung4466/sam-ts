import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import ResponseObj from '../classes/ResponseObj';
import HttpException from '../exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';

type LambdaHandler = (event: APIGatewayEvent, context: Context) => Promise<APIGatewayProxyResult>;

export const withErrorHandling = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayEvent, context: Context) => {
    try {
      return await handler(event, context);
    } catch (error:any) {
      // Handle error, log it, etc.
      const errorMessage = error.message || "Unknown Error"
      if(error instanceof HttpException) {
        return new ResponseObj(error.statusCode, error.messages, null)
      }

      // Return a response with an error status code and message
      return new ResponseObj(StatusCodes.INTERNAL_SERVER_ERROR, [errorMessage])
    }
  };
};
