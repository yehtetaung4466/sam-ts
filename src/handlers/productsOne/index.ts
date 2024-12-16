import { APIGatewayEvent, Context } from "aws-lambda";
import { greet } from "/opt/shared/greet";  
import moment from "moment";
import ResponseObj from "/opt/shared/classes/ResponseObj";
import { withErrorHandling } from "/opt/shared/middlewares/witherrorhandling";
import { productService } from "/opt/services/product.service";
import validateParams from "/opt/shared/validators/params.validate";
import productParams from "/opt/shared/payloads/product/product.params";
import { StatusCodes } from "http-status-codes";

export const handler = withErrorHandling(main);
async function main(event: APIGatewayEvent, _context: Context) {
  const params = validateParams(event,productParams)
  const {id} = params;  
  const greeting = greet('Aws super super ',moment());
  const product = await productService.findOne(+id)
  return new ResponseObj(StatusCodes.OK, [greeting], product)
};