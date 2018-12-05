import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import Journal from '../../interfaces/Journal';
import context, { ServiceIdentifiers } from './config/context';
import { JournalRetriever } from './service/JournalRetriever';
import createResponse from '../../utils/createResponse';

const journalRetriever = context.get<JournalRetriever>(ServiceIdentifiers.JournalRetriever);

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
  const journal: Journal = journalRetriever.getJournal();
  const response = createResponse(journal);
  callback(null, response);
}
