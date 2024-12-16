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
    const layers = config.layers.map(l=>capitalizeLayers(l));
    const functions = config.functions;

    const template = `
AWSTemplateFormatVersion: 2010-09-09
Description: >-
  sam-ts
Transform:
- AWS::Serverless-2016-10-31

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
      CodeUri: dist/handlers/${func.name}
      Handler: index.handler
      Runtime: nodejs18.x
      Architectures:
        - x86_64
      MemorySize: 128
      Timeout: 100
      Events:
        Api:
          Type: Api
          Properties:
            Path: ${func.path}
            Method: ${func.method}
      ${func.layers.length > 0 ? `Layers:
        ${func.layers.map(layer => `- !Ref ${capitalizeLayers(layer)}`).join('\n        ')}
      ` : ''}
`).join('')}

Outputs:
  WebEndpoint:
    Description: API Gateway endpoint URL for Prod stage
    Value: !Sub "https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/"
`;

    // Write the generated template to a file
    writeFileSync('template.yaml', template.trim());
    console.log('template.yaml has been generated successfully.');
}

// Execute the main function
main();
