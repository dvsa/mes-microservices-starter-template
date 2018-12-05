import Journal from '../../../interfaces/Journal';

export interface JournalRetriever {
  getJournal(): Journal;
}
