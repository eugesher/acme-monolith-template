import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IStaffAuthCorePort } from '@acme-core/contracts/staff-auth';

import { AuthGlobalSubjectCoreAdapter } from '../auth-global-subject-core.adapter';

describe('AuthGlobalSubjectCoreAdapter', () => {
  let staffAuthCore: jest.Mocked<IStaffAuthCorePort>;
  let adapter: AuthGlobalSubjectCoreAdapter;

  beforeEach(() => {
    staffAuthCore = { handleFindSubject: jest.fn() };
    adapter = new AuthGlobalSubjectCoreAdapter(staffAuthCore);
  });

  describe('findSubject', () => {
    it('answers the id, the email and the permission codes of the subject the core finds', async () => {
      staffAuthCore.handleFindSubject.mockResolvedValue({
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
      expect(staffAuthCore.handleFindSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no subject when the core finds no active staff user', async () => {
      staffAuthCore.handleFindSubject.mockResolvedValue(null);

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
    });
  });
});
