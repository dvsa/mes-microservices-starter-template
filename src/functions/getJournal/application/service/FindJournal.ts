import { getJournal } from '../../framework/aws/DynamoJournalRepository';
import { ExaminerWorkSchedule } from '../../../../common/domain/Journal';
import * as moment from 'moment';

/**
 *  The class below is also found in MES-Mobile-App in bin/update-mock-data.ts
 *  So if you find a bug please fix it in both places.
 */
class DateUpdater {

  private dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  constructor(public data: ExaminerWorkSchedule) { }

  public updateTestSlots = (): DateUpdater => {
    if (!this.data.testSlots) { return this; }

    this.updateSlots(this.data.testSlots);
    return this;
  }

  public updateNonTestActivities = (): DateUpdater => {
    if (!this.data.nonTestActivities) { return this; }

    this.updateSlots(this.data.nonTestActivities);
    return this;
  }

  public getData = (): ExaminerWorkSchedule => {
    return this.data;
  }

  private updateSlots = (slots: any[]) => {

    if (!slots || slots.length === 0 || !slots[0].slotDetail || !slots[0].slotDetail.start) {
      return;
    }

    const newDate = this.createMoment();
    let dateProcessing = this.createMoment(slots[0].slotDetail.start);

    slots.forEach((slot) => {
      if (!slot.slotDetail || !slot.slotDetail.start) { return; }

      const slotDate = this.createMoment(slot.slotDetail.start);

      dateProcessing = this.caculateNewProcessingDate(dateProcessing, slotDate, newDate);

      slot.slotDetail.start = this.updateDate(slotDate, newDate);
    });
  }

  private doesMatch = (a: moment.Moment, b: moment.Moment): boolean => {
    return a.isSame(b, 'day');
  }

  private caculateDiffInDays = (a: moment.Moment, b: moment.Moment): number => {
    return this.createMoment(a).startOf('day').diff(this.createMoment(b).startOf('day'), 'days');
  }

  private createMoment = (date?: string | moment.Moment): moment.Moment => {
    if (date) {
      return moment(date, this.dateFormat, true);
    }
    return moment();
  }

  private updateDate = (currentDate: moment.Moment, newDate: moment.Moment): string => {
    const daysToAdd = this.caculateDiffInDays(newDate, currentDate);
    return currentDate.add(daysToAdd, 'days').format(this.dateFormat);
  }

  private caculateNewProcessingDate = (
    dateProcessing: moment.Moment,
    itemDate: moment.Moment,
    newDate: moment.Moment,
  ): moment.Moment => {
    if (this.doesMatch(dateProcessing, itemDate)) { return dateProcessing; }

    const daysToAdd = this.caculateDiffInDays(itemDate, dateProcessing);
    newDate.add(daysToAdd, 'days');
    return this.createMoment(itemDate);
  }
}

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
 * All Code below this line is a Temporary measure that will make sure slots
 * have the correct dates.
 */

function updateDates(journal: ExaminerWorkSchedule): ExaminerWorkSchedule {

  return new DateUpdater(journal)
    .updateTestSlots()
    .updateNonTestActivities()
    .getData();
}
