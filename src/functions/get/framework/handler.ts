import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import context, { ServiceIdentifiers } from '../application/context';
import { JournalRetriever } from '../application/service/JournalRetriever';
import createResponse from '../../../common/application/utils/createResponse';
import { ExaminerWorkSchedule } from '../../../common/domain/Journal.d';

const journalRetriever: JournalRetriever =
  context.get<JournalRetriever>(ServiceIdentifiers.JournalRetriever);

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  const journal: ExaminerWorkSchedule = journalRetriever.getJournal();
  return createResponse(journal);
}
