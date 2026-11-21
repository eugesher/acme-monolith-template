import { AuthCommonFacade } from '../auth-common.facade';
import type { AuthCommonFindSubjectUseCase } from '../../application';

describe('AuthCommonFacade', () => {
  let findSubject: jest.Mocked<Pick<AuthCommonFindSubjectUseCase, 'execute'>>;
  let facade: AuthCommonFacade;

  beforeEach(() => {
    findSubject = { execute: jest.fn() };
    findSubject.execute.mockResolvedValue(null);
    facade = new AuthCommonFacade(findSubject as unknown as AuthCommonFindSubjectUseCase);
  });

  describe('handleFindSubject', () => {
    it('hands the command to the find subject use case', async () => {
      const subject = await facade.handleFindSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
      expect(findSubject.execute).toHaveBeenCalledWith({ userId: 'user-1' });
    });
  });
});
