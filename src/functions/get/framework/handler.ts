import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import Journal from '../../../common/domain/Journal';
import context, { ServiceIdentifiers } from '../application/context';
import { JournalRetriever } from '../application/service/JournalRetriever';
import createResponse from '../../../common/application/utils/createResponse';

const journalRetriever: JournalRetriever =
  context.get<JournalRetriever>(ServiceIdentifiers.JournalRetriever);

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
  const journal: Journal = journalRetriever.getJournal();
  callback(null, createResponse(journal));
}
