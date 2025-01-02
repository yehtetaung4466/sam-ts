import { APIGatewayEvent, Context } from "aws-lambda";
import AWS from "aws-sdk"; // AWS SDK for interacting with S3

import { createProductDto } from "/opt/shared/payloads/product/product.dto";
import productService from "/opt/services/product.service";
import ResponseObj from "/opt/shared/classes/ResponseObj";
import { withErrorHandling } from "/opt/shared/middlewares/witherrorhandling";
import validateBody from "/opt/shared/validators/body.validate";
import s3 from "/opt/lib/s3";
import getMessage from "/opt/shared/helper/getmessage";
import Operation from "/opt/shared/enumns/operation";
import HttpException from "/opt/shared/exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import Message from "/opt/shared/enumns/message";


// Wrap the handler with error handling middleware
export const handler = withErrorHandling(main);

async function main(event: APIGatewayEvent, context: Context) {
  // Validate the fields (e.g., name, price) using Zod schema
  const data = await validateBody(event, createProductDto);

  console.log(data.image?.contentType);  // Log content type of the image (optional)
  console.log(data);  // Log all the data (optional)

  const { price, name, image } = data;

  // Upload the image to S3 if there's an image
  if (image) {
    try {
      const uploadResult = await s3.upload(image)


      const presignedUrl = s3.getSignedUrlSync(uploadResult.Key);

      // Save the product with the image URL
      await productService.createOne({ name, image: uploadResult.Key.replace('minio','localhost'), price });

      // Return success response
      return new ResponseObj(200, [getMessage('Product',Operation.CREATE)], { imageUrl: presignedUrl.replace('minio','localhost') });
    } catch (error) {
      console.error("Error uploading image to S3", error);
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR,[Message.INTERNAL_SERVER_ERROR])
    }
  }

  // If no image, just save the product without an image
  await productService.createOne({ name, price });

  // Return success response
  return new ResponseObj(StatusCodes.OK, [getMessage('Product',Operation.CREATE)], undefined);
}
