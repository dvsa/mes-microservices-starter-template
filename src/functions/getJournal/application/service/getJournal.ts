import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';
import fetchJournalFromDynamo from '../../framework/fetchJournalFromDynamo';

export default async function (staffNumber: string) {
  const journalWrapper = await fetchJournalFromDynamo(staffNumber);

  if (journalWrapper === null || journalWrapper === undefined) {
    return journalWrapper;
  }

  return journalWrapper.journal;
}
