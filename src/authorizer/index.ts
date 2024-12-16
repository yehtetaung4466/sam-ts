import * as jwt from 'jsonwebtoken'; // Assuming you're using the 'jsonwebtoken' package for decoding

export const handler = async (event: any) => {
  const token = event.authorizationToken; // Get the token from the Authorization header

  // Validate the JWT token
  const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!); // Ensure you use the correct secret

  if (!decodedToken) {
    throw new Error('Unauthorized');
  }

  // Extract user_id (or any other relevant data from the token)
  const userId = decodedToken.user_id;

  // Return the IAM policy and add the user_id to the context
  return {
    principalId: userId, // The unique identifier for the user (can be used for other purposes)
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn, // The method ARN for the specific API route
        },
      ],
    },
    context: {
      user_id: userId,  // Pass the user_id to the Lambda context (this is what you want)
    },
  };
};
