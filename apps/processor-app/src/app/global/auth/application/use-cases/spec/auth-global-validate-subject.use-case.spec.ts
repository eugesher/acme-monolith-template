import { PermissionCodeEnum } from '@acme-libs/kernel';

import { AuthGlobalValidateSubjectUseCase } from '../auth-global-validate-subject.use-case';
import type { IAuthGlobalSubjectPort } from '../../../outbound';

describe('AuthGlobalValidateSubjectUseCase', () => {
  let subject: jest.Mocked<IAuthGlobalSubjectPort>;
  let useCase: AuthGlobalValidateSubjectUseCase;

  beforeEach(() => {
    subject = { findSubject: jest.fn() };
    useCase = new AuthGlobalValidateSubjectUseCase(subject);
  });

  describe('execute', () => {
    it('answers the id, the email and the permission codes of the subject as the current user', async () => {
      subject.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const user = await useCase.execute({ userId: 'user-1' });

      expect(user).toEqual({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: ['ledger:read'],
      });
      expect(subject.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no user when there is no active subject', async () => {
      subject.findSubject.mockResolvedValue(null);

      const user = await useCase.execute({ userId: 'user-1' });

      expect(user).toBeNull();
    });
  });
});
