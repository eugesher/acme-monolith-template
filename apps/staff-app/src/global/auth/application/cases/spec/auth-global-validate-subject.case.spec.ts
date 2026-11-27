import { PermissionCodeEnum } from '@acme-libs/kernel';

import { AuthGlobalValidateSubjectCase } from '../auth-global-validate-subject.case';
import type { IAuthGlobalCredentialsPort, IAuthGlobalSubjectPort } from '../../../outbound';

describe('AuthGlobalValidateSubjectCase', () => {
  let subject: jest.Mocked<IAuthGlobalSubjectPort>;
  let credentials: jest.Mocked<IAuthGlobalCredentialsPort>;
  let validateSubjectCase: AuthGlobalValidateSubjectCase;

  beforeEach(() => {
    subject = { findSubject: jest.fn() };
    credentials = { verifyAccessToken: jest.fn() };
    credentials.verifyAccessToken.mockResolvedValue('user-1');
    validateSubjectCase = new AuthGlobalValidateSubjectCase(subject, credentials);
  });

  describe('execute', () => {
    it('answers the id, the email and the permission codes of the token subject as the current user', async () => {
      subject.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const user = await validateSubjectCase.execute({ token: 'access-token' });

      expect(user).toEqual({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: ['ledger:read'],
      });
      expect(credentials.verifyAccessToken).toHaveBeenCalledWith('access-token');
      expect(subject.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no user for a token that does not verify, without looking for a subject', async () => {
      credentials.verifyAccessToken.mockResolvedValue(null);

      const user = await validateSubjectCase.execute({ token: 'access-token' });

      expect(user).toBeNull();
      expect(subject.findSubject).not.toHaveBeenCalled();
    });

    it('answers no user when there is no active subject', async () => {
      subject.findSubject.mockResolvedValue(null);

      const user = await validateSubjectCase.execute({ token: 'access-token' });

      expect(user).toBeNull();
    });
  });
});
