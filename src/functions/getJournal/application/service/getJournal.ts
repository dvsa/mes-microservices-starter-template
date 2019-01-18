import fetchJournalFromDynamo from '../../framework/fetchJournalFromDynamo';
import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';

export default async function (staffNumber: string): Promise<ExaminerWorkSchedule | null> {
  const journalWrapper = await fetchJournalFromDynamo(staffNumber);

  if (!journalWrapper || !journalWrapper.journal) {
    return null;
  }

  return journalWrapper.journal;
}
