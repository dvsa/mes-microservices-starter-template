import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import { ExaminerWorkSchedule } from '../../../common/domain/Journal.d';
import Response from '../../../common/application/api/Response';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import * as logger from '../../../common/application/utils/logger';
import { getJournal } from '../application/service/getStaticJournal';
import { getDynamicJournal } from '../application/service/getDynamicJournal';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  let response: Response;
  const modifiedSince = tryGetIfModifiedSince(event.headers);
  try {
    const journal: ExaminerWorkSchedule = modifiedSince ? getDynamicJournal() : getJournal();
    response = createResponse(journal);
  } catch (err) {
    logger.error(err);
    response = createResponse('Unable to retrieve journal', HttpStatus.BAD_GATEWAY);
  }
  return response;
}

function tryGetIfModifiedSince(headers: { [key: string]: string }): number | null {
  const ifModifedSinceHeader =  Object.keys(headers)
    .find(key => key.toLowerCase() === 'if-modified-since');

  if (!ifModifedSinceHeader) {
    return null;
  }

  const isModifiedSince = parseInt(headers[ifModifedSinceHeader], 10);
  return isNaN(isModifiedSince) ? null : isModifiedSince;
}
