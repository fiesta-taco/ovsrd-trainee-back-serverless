
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';

const hello  = async ():Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    message: `Hello customer!`,
    
  });
};

export const main = middyfy(hello);
