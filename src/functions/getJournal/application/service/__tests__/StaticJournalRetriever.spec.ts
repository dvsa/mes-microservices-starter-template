import 'reflect-metadata';
import { StaticJournalRetriever } from '../StaticJournalRetriever';
import { JournalRetriever } from '../JournalRetriever';
import { Logger } from '../../../../../common/application/utils/logging/Logger';

describe('StaticJournalRetriever', () => {
  let staticJournalRetriever: JournalRetriever;
  const dummyLogger: Logger = jasmine.createSpyObj('Logger', ['info']);
  beforeEach(() => {
    staticJournalRetriever = new StaticJournalRetriever(dummyLogger);
  });

  describe('getJournal', () => {
    it('should return a non-null Journal model', () => {
      expect(staticJournalRetriever.getJournal()).toBeDefined();
    });
  });
});
