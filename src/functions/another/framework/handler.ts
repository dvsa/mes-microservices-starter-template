import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
  callback(null, createResponse({}));
}
