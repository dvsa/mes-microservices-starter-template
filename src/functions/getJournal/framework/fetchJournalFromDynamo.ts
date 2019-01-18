import { DynamoDB } from 'aws-sdk';
import { JournalWrapper } from '../domain/journalWrapper';
import * as logger from '../../../common/application/utils/logger';

const ddb = new DynamoDB.DocumentClient();
const tableName = getJournalTableName();

export default async function (staffNumber: string): Promise<JournalWrapper | null> {
  try {
    const journalGetResult = await ddb.get({
      TableName: tableName,
      Key: {
        staffNumber,
      },
    }).promise();
    return journalGetResult.Item as JournalWrapper;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

function getJournalTableName(): string {
  let tableName = process.env.JOURNAL_DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    logger.warn('No journal table name set, using default');
    tableName = 'journal';
  }
  return tableName;
}
