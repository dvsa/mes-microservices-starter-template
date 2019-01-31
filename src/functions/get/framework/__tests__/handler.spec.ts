import * as aws from 'aws-sdk-mock';
import { ExaminerWorkSchedule } from '../../../../common/domain/Schema';
import { handler } from '../handler';
const lambdaTestUtils = require('aws-lambda-test-utils');
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent, Context } from 'aws-lambda';

describe('getJournal handler', () => {
  const fakeJournal: ExaminerWorkSchedule = {
    examiner: {
      staffNumber: '123',
    },
  };
  let dummyApigwEvent: APIGatewayEvent;
  let dummyContext: Context;
  let createResponseSpy: jasmine.Spy;

  beforeEach(() => {
    createResponseSpy = spyOn(createResponse, 'default');
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      pathParameters: {
        staffNumber: '01234567',
      },
    });
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);
  });

  describe('given the FindJournal returns a journal', () => {
    it('should return a successful response with the journal', async () => {
      aws.mock('DynamoDB.DocumentClient', 'get', (params, cb) => cb(null, { Item: fakeJournal }));
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp: any = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default).toHaveBeenCalledWith(fakeJournal);
    });
  });
});
