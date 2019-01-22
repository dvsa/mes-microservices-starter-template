import { getJournal } from '../../framework/aws/DynamoJournalRepository';
import { ExaminerWorkSchedule, TestSlot } from '../../../../common/domain/Journal';
import * as moment from 'moment';

export async function findJournal(staffNumber: string): Promise<ExaminerWorkSchedule | null> {
  const journalWrapper = await getJournal(staffNumber);

  if (!journalWrapper) {
    return null;
  }

  const journal: ExaminerWorkSchedule = journalWrapper.journal;
  const updatedJournal = updateDates(journal);

  return updatedJournal;
}

/**
 * All Code below this line is a Temporary measure that will make sure slots have the correct dates. 
 */

const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'

function updateDates(journal: ExaminerWorkSchedule): ExaminerWorkSchedule {
  return {
    ...journal,
    testSlots: journal.testSlots ? updateTestSlots(journal.testSlots) : [],
    nonTestActivities: journal.nonTestActivities ? updateTestSlots(journal.nonTestActivities) : [],
  };
}

/**
 *  The functions below are also found in MES-Mobile-App in bin/update-mock-data.js 
 *  So if you find a bug please fix it in both places
 */

function updateTestSlots(testSlots: any[]) {

  if (testSlots.length === 0) { return [] };

  let newDate = createMoment();
  let dateProcessing = createMoment(testSlots[0].slotDetail.start);

  testSlots.forEach(slot => {
    let slotDate = createMoment(slot.slotDetail.start)

    dateProcessing = caculateNewProcessingDate(dateProcessing, slotDate, newDate);

    slot.slotDetail.start = updateDate(slotDate, newDate);
  });

  return testSlots;
};

function doesMatch(a: moment.Moment, b: moment.Moment) {
  return a.isSame(b, 'day');
};

function caculateDiffInDays(a: moment.Moment, b: moment.Moment) {
  return createMoment(a).startOf('day').diff(createMoment(b).startOf('day'), 'days');
}

function createMoment(date?: moment.Moment) {
  if (date) {
    return moment(date, dateFormat, true);
  }
  return moment()
}

function updateDate(currentDate: moment.Moment, newDate: moment.Moment) {
  let daysToAdd = caculateDiffInDays(newDate, currentDate);
  return currentDate.add(daysToAdd, 'days').format(dateFormat);
};

function caculateNewProcessingDate(dateProcessing: moment.Moment, itemDate: moment.Moment, newDate: moment.Moment) {
  if (doesMatch(dateProcessing, itemDate)) { return dateProcessing; }

  let daysToAdd = caculateDiffInDays(itemDate, dateProcessing)
  newDate.add(daysToAdd, 'days');
  return createMoment(itemDate);
}
