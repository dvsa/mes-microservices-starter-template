import { JournalRetriever } from './JournalRetriever';
import { ExaminerWorkSchedule } from '../../../../common/domain/Journal.d';
import { injectable } from 'inversify';

@injectable()
export class StaticJournalRetriever implements JournalRetriever {

  getJournal(): ExaminerWorkSchedule {
    return {
      staffNumber: 1234,
      examinerName: {},
      permTestCentre: {},
      testSlot: [],
      personalCommitment: [],
      nonTestActivity: [],
      advanceTestSlot: [],
      deployment: [],
    };
  }

}
