import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCommonPort } from '@acme-staff/contracts/auth';

import { AuthIdentityCommonAdapter } from '../auth-identity-common.adapter';

describe('AuthIdentityCommonAdapter', () => {
  let authCommon: jest.Mocked<IAuthCommonPort>;
  let adapter: AuthIdentityCommonAdapter;

  beforeEach(() => {
    authCommon = { findSubject: jest.fn() };
    adapter = new AuthIdentityCommonAdapter(authCommon);
  });

  describe('findSubject', () => {
    it('answers the subject the core staff auth module finds for the user', async () => {
      authCommon.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toEqual({ id: 'user-1', email: 'ann@example.com', roles: ['admin'] });
      expect(authCommon.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers null when the core staff auth module finds no active user', async () => {
      authCommon.findSubject.mockResolvedValue(null);

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
    });
  });
});
