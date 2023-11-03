import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';

// Remove when logic implemented
// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('get-service-name', event);

    return createResponse({ data: 'some data' });
  } catch (err: unknown) {
    error((err instanceof Error) ? err.message : `Unknown error: ${err as string}`);

    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
