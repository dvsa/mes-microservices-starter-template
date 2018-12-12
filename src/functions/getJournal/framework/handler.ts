import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import context, { ServiceIdentifiers } from './context';
import { JournalRetriever } from '../application/service/JournalRetriever';
import createResponse from '../../../common/application/utils/createResponse';
import { ExaminerWorkSchedule } from '../../../common/domain/Journal.d';
import Response from '../../../common/application/api/Response';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import * as logger from '../../../common/application/utils/logger';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const journalRetriever = context.get<JournalRetriever>(ServiceIdentifiers.JournalRetriever);

  let response: Response;
  try {
    const journal: ExaminerWorkSchedule = journalRetriever.getJournal();
    response = createResponse(journal);
  } catch (err) {
    logger.error(err);
    response = createResponse('Unable to retrieve journal', HttpStatus.BAD_GATEWAY);
  }
  return response;
}
