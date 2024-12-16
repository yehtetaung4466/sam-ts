import { ZodSchema } from "zod";
import HttpException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import { APIGatewayEvent } from "aws-lambda";

export default function validateBody<T>(event: APIGatewayEvent, schema: ZodSchema<T>) {
  const payload = JSON.parse(event.body || "{}");
  const result = schema.safeParse(payload);

  if (!result.success) {
    // Extract validation errors
    const errors = result.error.errors.map((err) => err.message);

    throw new HttpException(StatusCodes.BAD_REQUEST,errors)
  }

  // Return parsed data if validation succeeds
  return result.data;
}
