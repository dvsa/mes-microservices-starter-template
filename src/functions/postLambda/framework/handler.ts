import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  bootstrapLogging, error,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';

// Remove when logic implemented
// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('post-service-name', event);

    if (!event.body) {
      error('Event body is empty');
      return createResponse({ msg: 'Event body is empty' }, HttpStatus.BAD_REQUEST);
    }

    return createResponse({ ...JSON.parse(event.body) });
  } catch (err) {
    error((err instanceof Error) ? err.message : `Unknown error: ${err as string}`);

    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
