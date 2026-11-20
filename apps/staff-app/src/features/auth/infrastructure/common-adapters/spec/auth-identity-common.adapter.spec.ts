import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IStaffAuthCommonPort } from '@acme-staff/contracts/staff-auth';

import { AuthIdentityCommonAdapter } from '../auth-identity-common.adapter';

describe('AuthIdentityCommonAdapter', () => {
  let staffAuthCore: jest.Mocked<IStaffAuthCommonPort>;
  let adapter: AuthIdentityCommonAdapter;

  beforeEach(() => {
    staffAuthCore = { handleFindSubject: jest.fn() };
    adapter = new AuthIdentityCommonAdapter(staffAuthCore);
  });

  describe('findSubject', () => {
    it('answers the subject the core staff auth module finds for the user', async () => {
      staffAuthCore.handleFindSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
        permissionCodes: [PermissionCodeEnum.LEDGER_READ],
      });

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toEqual({ id: 'user-1', email: 'ann@example.com', roles: ['admin'] });
      expect(staffAuthCore.handleFindSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers null when the core staff auth module finds no active user', async () => {
      staffAuthCore.handleFindSubject.mockResolvedValue(null);

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
    });
  });
});
