import type { AWS } from '@serverless/typescript';
import {
  createCard, createList, deleteCard, deleteList,
  getCardsByListId,
  getListsAndCards, updateCard, updateList
} from 'src/controllers';



const serverlessConfiguration: AWS = {
  service: 'aws-nodejs',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {

      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: [
            "arn:aws:dynamodb:us-east-1:*:table/ListTable",
            "arn:aws:dynamodb:us-east-1:*:table/CardTable",
            "arn:aws:dynamodb:us-east-1:*:table/CardTable/index/ListIdIndex",
          ]
        }],
      },

    },
  },
  functions: {
    getListsAndCards, createList, createCard, getCardsByListId,
    deleteList, deleteCard, updateCard, updateList
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ListTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "ListTable",
          AttributeDefinitions: [{
            AttributeName: "listId",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "listId",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },

        }
      },
      CardTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "CardTable",
          AttributeDefinitions: [
            { AttributeName: 'cardId', AttributeType: 'S' },
            { AttributeName: 'listId', AttributeType: 'S' },
          ],
          KeySchema: [
            {
              AttributeName: "cardId",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: "ListIdIndex",
              KeySchema: [
                {
                  AttributeName: "listId",
                  KeyType: "HASH",
                },

              ],
              Projection: {
                ProjectionType: "ALL",
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;

