import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IStaffAuthCorePort } from '@acme-core/contracts/staff-auth';

import { AuthIdentityCoreAdapter } from '../auth-identity-core.adapter';

describe('AuthIdentityCoreAdapter', () => {
  let staffAuthCore: jest.Mocked<IStaffAuthCorePort>;
  let adapter: AuthIdentityCoreAdapter;

  beforeEach(() => {
    staffAuthCore = { handleFindSubject: jest.fn() };
    adapter = new AuthIdentityCoreAdapter(staffAuthCore);
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
