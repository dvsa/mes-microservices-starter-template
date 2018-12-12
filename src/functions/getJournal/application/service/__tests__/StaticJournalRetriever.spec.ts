import 'reflect-metadata';
import { StaticJournalRetriever } from '../StaticJournalRetriever';
import { JournalRetriever } from '../JournalRetriever';

describe('StaticJournalRetriever', () => {
  let staticJournalRetriever: JournalRetriever;
  beforeEach(() => {
    staticJournalRetriever = new StaticJournalRetriever();
  });

  describe('getJournal', () => {
    it('should return a non-null Journal model', () => {
      expect(staticJournalRetriever.getJournal()).toBeDefined();
    });
  });
});
