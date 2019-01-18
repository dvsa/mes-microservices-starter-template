import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import * as logger from '../../../common/application/utils/logger';
import getJournal from '../application/service/getJournal';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const staffNumber = getStaffNumber(event.pathParameters);
  if (staffNumber === null) {
    return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
  }

  let response: Response;
  try {
    const journal = await getJournal(staffNumber);

    if (journal === undefined) {
      response = createResponse(journal, HttpStatus.NOT_FOUND);
    } else {
      response = createResponse(journal);
    }
  } catch (err) {
    logger.error(err);
    response = createResponse('Unable to retrieve journal', HttpStatus.BAD_GATEWAY);
  }
  return response;
}

function getStaffNumber(pathParams: { [key: string]: string } | null) : string | null {
  if (pathParams === null
        || typeof pathParams.staffNumber !== 'string'
        || pathParams.staffNumber.trim().length === 0) {
    logger.warn('No staffNumber path parameter found');
    return null;
  }
  return pathParams.staffNumber;
}
