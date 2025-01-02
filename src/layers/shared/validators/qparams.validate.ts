import { ZodSchema } from "zod";
import HttpException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import { APIGatewayEvent } from "aws-lambda";

export default async function validateQueryParams<T>(event: APIGatewayEvent, schema: ZodSchema<T>) {
  const payload = event.queryStringParameters || {};
  const result = await schema.safeParseAsync(payload);
  
  if (!result.success) {
    // Extract validation errors
    const errors = result.error.errors.map((err) => err.message);

    throw new HttpException(StatusCodes.BAD_REQUEST,errors)
  }

  // Return parsed data if validation succeeds
  return result.data;
}
