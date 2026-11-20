import { StaffAuthCommonFacade } from '../staff-auth-common.facade';
import type { StaffAuthCommonFindSubjectUseCase } from '../../application';

describe('StaffAuthCommonFacade', () => {
  let findSubject: jest.Mocked<Pick<StaffAuthCommonFindSubjectUseCase, 'execute'>>;
  let facade: StaffAuthCommonFacade;

  beforeEach(() => {
    findSubject = { execute: jest.fn() };
    findSubject.execute.mockResolvedValue(null);
    facade = new StaffAuthCommonFacade(findSubject as unknown as StaffAuthCommonFindSubjectUseCase);
  });

  describe('handleFindSubject', () => {
    it('hands the command to the find subject use case', async () => {
      const subject = await facade.handleFindSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
      expect(findSubject.execute).toHaveBeenCalledWith({ userId: 'user-1' });
    });
  });
});
