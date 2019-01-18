import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import * as logger from '../../../common/application/utils/logger';
import { findJournal } from '../application/service/FindJournal';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const staffNumber = getStaffNumber(event.pathParameters);
  if (staffNumber === null) {
    return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
  }

  try {
    const journal = await findJournal(staffNumber);
    if (journal === null) {
      return createResponse({}, HttpStatus.NOT_FOUND);
    }
    return createResponse(journal);
  } catch (err) {
    logger.error(err);
    return createResponse('Unable to retrieve journal', HttpStatus.BAD_GATEWAY);
  }
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
