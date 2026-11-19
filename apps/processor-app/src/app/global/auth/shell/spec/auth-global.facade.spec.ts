import { PermissionCodeEnum } from '@acme-libs/kernel';

import { AuthGlobalValidateSubjectUseCase } from '../../application';
import { AuthGlobalFacade } from '../auth-global.facade';

describe('AuthGlobalFacade', () => {
  let subject: jest.Mocked<ConstructorParameters<typeof AuthGlobalValidateSubjectUseCase>[0]>;
  let facade: AuthGlobalFacade;

  beforeEach(() => {
    subject = { findSubject: jest.fn() };
    facade = new AuthGlobalFacade(new AuthGlobalValidateSubjectUseCase(subject));
  });

  describe('handleValidate', () => {
    it('answers the user with its permission codes for the token subject', async () => {
      subject.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const user = await facade.handleValidate({ sub: 'user-1' });

      expect(user).toEqual({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: ['ledger:read'],
      });
      expect(subject.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no user when the subject is not an active staff user', async () => {
      subject.findSubject.mockResolvedValue(null);

      const user = await facade.handleValidate({ sub: 'user-1' });

      expect(user).toBeNull();
    });
  });
});
