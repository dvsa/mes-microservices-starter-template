import { DynamoDB } from 'aws-sdk';
import { JournalWrapper } from '../../domain/JournalWrapper';
import * as logger from '../../../../common/application/utils/logger';

const ddb = new DynamoDB.DocumentClient();
const tableName = getJournalTableName();

export async function getJournal(staffNumber: string): Promise<JournalWrapper | null> {
  const journalGetResult = await ddb.get({
    TableName: tableName,
    Key: {
      staffNumber,
    },
  }).promise();

  if (journalGetResult.Item === undefined) {
    return null;
  }

  return journalGetResult.Item as JournalWrapper;
}

function getJournalTableName(): string {
  let tableName = process.env.JOURNAL_DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    logger.warn('No journal table name set, using the default');
    tableName = 'journal';
  }
  return tableName;
}
