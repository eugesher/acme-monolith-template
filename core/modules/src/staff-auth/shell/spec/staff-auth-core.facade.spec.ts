import { StaffAuthCoreFacade } from '../staff-auth-core.facade';
import type { StaffAuthCoreFindSubjectUseCase } from '../../application';

describe('StaffAuthCoreFacade', () => {
  let findSubject: jest.Mocked<Pick<StaffAuthCoreFindSubjectUseCase, 'execute'>>;
  let facade: StaffAuthCoreFacade;

  beforeEach(() => {
    findSubject = { execute: jest.fn() };
    findSubject.execute.mockResolvedValue(null);
    facade = new StaffAuthCoreFacade(findSubject as unknown as StaffAuthCoreFindSubjectUseCase);
  });

  describe('handleFindSubject', () => {
    it('hands the command to the find subject use case', async () => {
      const subject = await facade.handleFindSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
      expect(findSubject.execute).toHaveBeenCalledWith({ userId: 'user-1' });
    });
  });
});
