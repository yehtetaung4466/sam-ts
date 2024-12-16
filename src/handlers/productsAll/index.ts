import { APIGatewayEvent, Context } from "aws-lambda";
import { greet } from "/opt/shared/greet";  
import { db } from "/opt/lib/database";
import moment from "moment";
import ResponseObj from "/opt/shared/classes/ResponseObj";
import { withErrorHandling } from "/opt/shared/middlewares/witherrorhandling";

export const handler = withErrorHandling(main);
async function main(event: APIGatewayEvent, context: Context) {
  const greeting = greet('Aws super super ',moment());
  const products = await db.query.product.findMany();
  return new ResponseObj(200,[greeting],products)
};