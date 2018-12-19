import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';
import { handler } from '../handler';
const lambdaTestUtils = require('aws-lambda-test-utils');
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent, Context } from 'aws-lambda';
import * as getJournalModule from '../../application/service/getStaticJournal';

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
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);
  });

  describe('given the JournalRetriever returns a journal', () => {
    it('should return a successful response with the journal', async () => {
      spyOn(getJournalModule, 'getJournal').and.returnValue(fakeJournal);
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default).toHaveBeenCalledWith(fakeJournal);
    });
  });

  describe('given the JournalRetriever throws', () => {
    it('should return an error response', async () => {
      spyOn(getJournalModule, 'getJournal').and.throwError('Unable to retrieve journal');
      createResponseSpy.and.returnValue({ statusCode: 502 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(502);
      expect(createResponse.default).toHaveBeenCalledWith('Unable to retrieve journal', 502);
    });
  });
});