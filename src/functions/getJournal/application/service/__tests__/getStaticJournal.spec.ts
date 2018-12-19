import { getJournal } from '../getStaticJournal';
describe('StaticJournalRetriever', () => {
  describe('getJournal', () => {
    it('should return a non-null Journal model', () => {
      expect(getJournal()).toBeDefined();
    });
  });
});
