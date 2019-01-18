import { getJournal } from '../../framework/aws/DynamoJournalRepository';
import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';

export async function findJournal(staffNumber: string): Promise<ExaminerWorkSchedule | null> {
  const journalWrapper = await getJournal(staffNumber);

  if (!journalWrapper || !journalWrapper.journal) {
    return null;
  }

  return journalWrapper.journal;
}
