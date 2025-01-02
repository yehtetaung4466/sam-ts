import { writeFileSync } from 'fs';
import config from '../config/template.json';
import dotenv from 'dotenv';

dotenv.config();

// Capitalizes the first letter of each string in the array
function capitalizeLayers(layer: string): string {
  return layer.charAt(0).toUpperCase() + layer.slice(1).toLowerCase();
}

// Main function to generate the SAM template
function main() {
  const layers = config.layers.map(l => capitalizeLayers(l));
  const functions = config.functions;

  const template = `
AWSTemplateFormatVersion: 2010-09-09
Transform: AWS::Serverless-2016-10-31

Resources:
  # Define the Lambda layers
${layers.map(layer => `
  ${layer}:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: ${layer}
      Description: A ${layer} layer
      ContentUri: dist/layer-${layer.toLowerCase()}
      CompatibleRuntimes:
        - nodejs18.x
`).join('')}

  # Define the Lambda functions
${functions.map(func => `
  ${func.name}Function:
    Type: AWS::Serverless::Function
    Properties:
      Environment:
        Variables:
          DATABASE_URL: ${process.env.DATABASE_URL || 'DATABASE_URL_NOT_SET'}
          AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID || 'AWS_ACCESS_KEY_ID_NOT_SET' }
          AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY || 'AWS_SECRET_ACCESS_KEY_NOT_SET'}
          AWS_REGION: ${process.env.AWS_REGION || 'AWS_REGION_NOT_SET'}
          S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME || 'S3_BUCKET_NAME_NOT_SET'}
          S3_URL: ${process.env.S3_URL || 'S3_URL_NOT_SET'}
      CodeUri: dist/handlers/${func.name}
      Handler: index.handler
      Runtime: nodejs18.x
      Architectures:
        - x86_64
      MemorySize: 128
      Timeout: 1000
      Events:
        Api:
          Type: Api
          Properties:
            Path: ${func.path}
            Method: ${func.method}
            RestApiId: !Ref ApiGatewayRestApi
            RequestParameters:
            -  method.request.header.Content-Type  # Ensure Content-Type header is specified
      ${func.layers.length > 0 ? `Layers:
        ${func.layers.map(layer => `- !Ref ${capitalizeLayers(layer)}`).join('\n        ')}
      ` : ''}  
`).join('')}

  # Define the custom API Gateway with multipart/form-data support
  ApiGatewayRestApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: Prod
      Cors:
        AllowOrigin: "'*'"
        AllowHeaders: "'*'"
        AllowMethods: "'OPTIONS,GET,PUT,POST,DELETE'"
      BinaryMediaTypes:
        - multipart/form-data
Outputs:
  WebEndpoint:
    Description: API Gateway endpoint URL for Prod stage
    Value: !Sub "https://\${ApiGatewayRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/"
`;

  // Write the generated template to a file
  writeFileSync('template.yaml', template.trim());
  console.log('template.yaml has been generated successfully.');
}

// Execute the main function
main();
