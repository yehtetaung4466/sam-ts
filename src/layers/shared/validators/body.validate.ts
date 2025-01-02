import { ZodSchema } from "zod";
import HttpException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import { APIGatewayEvent } from "aws-lambda";
import multipart from "lambda-multipart-parser-v2"; // Replace with your actual multipart parser library

export default async function validateBody<T>(event: APIGatewayEvent, schema: ZodSchema<T>) {
  let payload: Record<string, any>;
  let files;

  // Determine content type
  const contentType = event.headers["Content-Type"] || event.headers["content-type"];

  if (!contentType) {
    throw new HttpException(StatusCodes.BAD_REQUEST, ["Missing content type."]);
  }

  if (contentType.includes("multipart/form-data")) {
    // Handle multipart/form-data
    try {
      const fields = await multipart.parse(event); // Ensure multipart parser is properly configured
      payload = fields;
      if (fields.files) {
        files = fields.files;
        fields.files.forEach((file: any) => {
          payload[file.fieldname] = file;
        });
      }

      // Convert numeric string fields to numbers
      for (const key in payload) {
        if (typeof payload[key] === "string" && !isNaN(Number(payload[key]))) {
          payload[key] = Number(payload[key]);
        }
      }
    } catch (error) {
      throw new HttpException(StatusCodes.BAD_REQUEST, ["Failed to parse multipart/form-data."]);
    }
  } else if (contentType.includes("application/json")) {
    // Handle application/json
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (error) {
      throw new HttpException(StatusCodes.BAD_REQUEST, ["Invalid JSON format."]);
    }
  } else {
    throw new HttpException(StatusCodes.UNSUPPORTED_MEDIA_TYPE, ["Unsupported content type. Expected application/json or multipart/form-data."]);
  }

  // Validate payload against schema
  const result = await schema.safeParseAsync(payload);

  if (!result.success) {
    console.log(result.error);

    // Extract validation errors
    const errors = result.error.errors.map((err) => err.message);
    throw new HttpException(StatusCodes.BAD_REQUEST, errors);
  }

  // Return parsed and validated data
  return result.data;
}
