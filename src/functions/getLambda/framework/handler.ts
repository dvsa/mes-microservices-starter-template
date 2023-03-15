import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import HttpStatus from '../../../common/application/api/HttpStatus';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';

async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  try {
    bootstrapLogging('service-name', event);
    await Promise.resolve();
    return createResponse({ data: 'some data' });
  } catch (err: unknown) {
    error('Error', err);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default handler;
