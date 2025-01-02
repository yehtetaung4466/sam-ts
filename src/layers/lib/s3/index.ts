import AWS from "aws-sdk";
import { MultipartFile } from "lambda-multipart-parser-v2";

const s3Client = new AWS.S3({
  endpoint: process.env.S3_URL, // Replace with your S3 endpoint
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret access key
  region: process.env.AWS_REGION, // Replace with your AWS region
  s3ForcePathStyle: true, // Required for local S3 compatibility
  sslEnabled: false, // Disable SSL for local S3 compatibility
});

async function upload(file:any) {
    const imageBuffer = Buffer.from(file.content, "base64"); // Convert base64 image to buffer


    const s3Params = {
        Bucket: BUCKET_NAME,
        Key: `product-images/${Date.now()}-${file.filename}`, // Unique image name
        Body: imageBuffer,
        ContentType: file.contentType, // Set the appropriate content type
      };

      // Upload the image to S3
      const uploadResult = await s3Client.upload(s3Params).promise();
      return uploadResult

}
function getSignedUrlSync(key:string) {
  const presignedUrlParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 60 * 60, // URL expires in 1 hour (adjust as needed)
  };

  const presignedUrl = s3Client.getSignedUrl('getObject', presignedUrlParams);
  return presignedUrl
}

async function remove(key:string) {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  await s3Client.deleteObject(deleteParams).promise();
}



export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'my-bucket'; // Replace with your S3 bucket name


export default {
    upload,
    getSignedUrlSync,
    remove
}