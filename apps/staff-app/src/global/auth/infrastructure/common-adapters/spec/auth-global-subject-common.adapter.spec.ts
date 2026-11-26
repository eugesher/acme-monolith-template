import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCommonPort } from '@acme-staff/contracts/auth';

import { AuthGlobalSubjectCommonAdapter } from '../auth-global-subject-common.adapter';

describe('AuthGlobalSubjectCommonAdapter', () => {
  let authCommon: jest.Mocked<IAuthCommonPort>;
  let adapter: AuthGlobalSubjectCommonAdapter;

  beforeEach(() => {
    authCommon = { handleFindSubject: jest.fn() };
    adapter = new AuthGlobalSubjectCommonAdapter(authCommon);
  });

  describe('findSubject', () => {
    it('answers the id, the email and the permission codes of the subject the core finds', async () => {
      authCommon.handleFindSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toEqual({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: ['ledger:read'],
      });
      expect(authCommon.handleFindSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no subject when the core finds no active staff user', async () => {
      authCommon.handleFindSubject.mockResolvedValue(null);

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
    });
  });
});
