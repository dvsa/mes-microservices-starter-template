import * as DynamoJournalRepository from '../../../framework/aws/DynamoJournalRepository';
import { findJournal } from '../FindJournal';

describe('FindJournal', () => {
  describe('findJournal', () => {
    it('should return null when the repo cant get the journal', async () => {
      spyOn(DynamoJournalRepository, 'getJournal').and.returnValue(null);

      const result = await findJournal('00000000');

      expect(result).toBeNull();
    });

    it('should return the journal embedded in the wrapper', async () => {
      spyOn(DynamoJournalRepository, 'getJournal')
        .and.returnValue({ journal: { staffNumber: '00000000' } });

      const result = await findJournal('00000000');

      // @ts-ignore
      expect(result.staffNumber).toBe('00000000');
    });
  });
});
