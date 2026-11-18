import { StaffAuthCoreFacade } from '../staff-auth-core.facade';
import type { StaffAuthCoreFindSubjectUseCase } from '../../application';

describe('StaffAuthCoreFacade', () => {
  let findSubject: jest.Mock;
  let facade: StaffAuthCoreFacade;

  beforeEach(() => {
    findSubject = jest.fn().mockResolvedValue(null);
    facade = new StaffAuthCoreFacade({
      execute: findSubject,
    } as unknown as StaffAuthCoreFindSubjectUseCase);
  });

  describe('handleFindSubject', () => {
    it('hands the command to the find subject use case', async () => {
      const subject = await facade.handleFindSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
      expect(findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });
  });
});
