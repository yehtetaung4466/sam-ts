import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Context } from "vm";

export type Middleware = (event: APIGatewayEvent, context: Context, next: Function) => Promise<APIGatewayProxyResult>;