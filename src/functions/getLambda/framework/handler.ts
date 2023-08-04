import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';

// Remove when logic implemented
// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('get-service-name', event);
    return createResponse({ data: 'some data' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      error('Error', err.message);
    } else {
      error('Error', err);
    }
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
