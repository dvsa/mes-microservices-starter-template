import { ExaminerWorkSchedule } from '../../../../common/domain/Journal.d';

export interface JournalRetriever {
  getJournal(): ExaminerWorkSchedule;
}
