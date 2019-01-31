import { HttpStatus } from './../../../../common/application/api/HttpStatus';
import * as aws from 'aws-sdk-mock';
import { ExaminerWorkSchedule } from '../../../../common/domain/Schema';
import { handler } from '../handler';
const lambdaTestUtils = require('aws-lambda-test-utils');
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent, Context } from 'aws-lambda';

describe('get handler', () => {
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
    aws.restore('DynamoDB.DocumentClient');
  });

  describe('given the handler returns a item', () => {
    it('should return a successful response with the journal', async () => {
      aws.mock('DynamoDB.DocumentClient', 'get', async params => ({ Item: fakeJournal }));
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp: any = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default).toHaveBeenCalledWith(fakeJournal);
    });
  });

  describe('given the handler returns undefined', () => {
    it('should return HTTP 404', async () => {
      aws.mock('DynamoDB.DocumentClient', 'get', async params => ({}));
      createResponseSpy.and.returnValue({ statusCode: 404 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(404);
      expect(createResponse.default).toHaveBeenCalledWith({}, 404);
    });
  });

  describe('given the handler throws', () => {
    it('should respond with internal server error', async () => {
      aws.mock('DynamoDB.DocumentClient', 'get', async (params) => {
        throw new Error('Unable to retrieve item');
      });
      createResponseSpy.and.returnValue({ statusCode: 500 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(500);
      expect(createResponse.default).toHaveBeenCalledWith('Unable to retrieve item', 500);
    });
  });
});
