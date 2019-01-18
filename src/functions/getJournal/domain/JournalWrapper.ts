import { ExaminerWorkSchedule } from '../../../common/domain/Journal';

export interface JournalWrapper {
  staffNumber: string;
  hash: string;
  lastUpdatedAt: number;
  journal: ExaminerWorkSchedule;
}
