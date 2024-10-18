import type { AWS } from '@serverless/typescript';
import {
  createCard, createList, deleteCard, deleteList,
  getCardsByListId, getListsAndCards, updateCard,
  updateList, dragCard, dragList,
} from 'src/controllers';

const serverlessConfiguration: AWS = {
  service: 'aws-nodejs',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage:'dev',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchWriteItem',
        ],
        Resource: [
          'arn:aws:dynamodb:eu-central-1:905418051827:table/*',
        ],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      LIST_TABLE: '${ssm:/${self:provider.stage}/list-table-name, null}',
      CARD_TABLE: '${ssm:/${self:provider.stage}/card-table-name, null}',
    },
  },
  functions: {
    getListsAndCards, createList, createCard, getCardsByListId,
    deleteList, deleteCard, updateCard, updateList, dragCard, dragList
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;