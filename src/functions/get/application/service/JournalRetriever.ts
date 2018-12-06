import Journal from '../../../../common/domain/Journal';

export interface JournalRetriever {
  getJournal(): Journal;
}
