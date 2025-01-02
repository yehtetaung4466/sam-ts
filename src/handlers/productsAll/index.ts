import { APIGatewayEvent, Context } from "aws-lambda";
import { greet } from "/opt/shared/greet";  
import { db } from "/opt/lib/database";
import moment from "moment";
import ResponseObj from "/opt/shared/classes/ResponseObj";
import { withErrorHandling } from "/opt/shared/middlewares/witherrorhandling";
import s3 from "/opt/lib/s3";
import getMessage from "/opt/shared/helper/getmessage";
import Operation from "/opt/shared/enumns/operation";

export const handler = withErrorHandling(main);
async function main(event: APIGatewayEvent, context: Context) {
  const greeting = greet('Aws super super ',moment());
  const products = await db.query.product.findMany(
    {
    orderBy:(fields, operators) =>{
    return operators.desc(fields.id)
    },
  });
  
  return new ResponseObj(200,[getMessage('products',Operation.GET)],products.map(p=>{
    const {image,...product} = p
    if(!image) return {...product,image:null}
    return {...product,image:s3.getSignedUrlSync(image).replace('minio','localhost')}
  }))
};