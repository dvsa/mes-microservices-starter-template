import { HttpStatus } from './../../../common/application/api/HttpStatus';
import { DynamoDB } from 'aws-sdk';
import * as logger from '../../../common/application/utils/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';

const createDynamoClient = () => {
  return process.env.IS_OFFLINE
    ? new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' })
    : new DynamoDB.DocumentClient();
};

const tableName = getTableName();

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const ddb = createDynamoClient();
  const staffNumber = getStaffNumber(event.pathParameters);
  try {

    const journalGetResult = await ddb.get({
      TableName: tableName,
      Key: {
        staffNumber,
      },
    }).promise();

    if (journalGetResult.Item === undefined) {
      return createResponse({}, HttpStatus.NOT_FOUND);
    }

    return createResponse(journalGetResult.Item);

  } catch (err) {

    logger.error(err);
    return createResponse('Unable to retrieve item', HttpStatus.INTERNAL_SERVER_ERROR);

  }

}

function getTableName(): string {
  let tableName = process.env.DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    logger.warn('No table name set, using the default');
    tableName = 'ddbTable';
  }
  return tableName;
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
