import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

export default async function (staffNumber: string) {
  try {
    const journalGetResult = await ddb.get({
      TableName: process.env.JOURNAL_DDB_TABLE_NAME || 'journal',
      Key: {
        staffNumber,
      },
    }).promise();
    return journalGetResult.Item;
  } catch (error) {

  }
  return null;
}
