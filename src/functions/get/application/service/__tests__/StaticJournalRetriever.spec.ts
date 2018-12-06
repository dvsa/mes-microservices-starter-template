import 'reflect-metadata';
import { StaticJournalRetriever } from '../StaticJournalRetriever';

describe('StaticJournalRetriever', () => {
  let staticJournalRetriever;
  beforeEach(() => {
    staticJournalRetriever = new StaticJournalRetriever();
  });

  describe('getJournal', () => {
    it('should return a non-null Journal model', () => {
      expect(staticJournalRetriever.getJournal()).toBeDefined();
    });
  });
});
