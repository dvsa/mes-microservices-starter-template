import context, { ServiceIdentifiers } from '../../framework/context';
import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';
import { JournalRetriever } from '../../application/service/JournalRetriever';
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

  class ErroringJournalRetriever implements JournalRetriever {
    getJournal(): ExaminerWorkSchedule {
      throw new Error('Journal retrieve failed');
    }
  }

  class FakeJournalRetriever implements JournalRetriever {
    getJournal(): ExaminerWorkSchedule {
      return fakeJournal;
    }
  }

  beforeEach(() => {
    createResponseSpy = spyOn(createResponse, 'default');
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);
  });

  describe('given the JournalRetriever returns a journal', () => {
    it('should return a successful response with the journal', async () => {
      context.rebind(ServiceIdentifiers.JournalRetriever)
        .toConstantValue(new FakeJournalRetriever());
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default).toHaveBeenCalledWith(fakeJournal);
    });
  });

  describe('given the JournalRetriever throws', () => {
    it('should return an error response', async () => {
      context.rebind(ServiceIdentifiers.JournalRetriever)
        .toConstantValue(new ErroringJournalRetriever());
      createResponseSpy.and.returnValue({ statusCode: 502 });

      const resp = await handler(dummyApigwEvent, dummyContext);

      expect(resp.statusCode).toBe(502);
      expect(createResponse.default).toHaveBeenCalledWith('Unable to retrieve journal', 502);
    });
  });
});
