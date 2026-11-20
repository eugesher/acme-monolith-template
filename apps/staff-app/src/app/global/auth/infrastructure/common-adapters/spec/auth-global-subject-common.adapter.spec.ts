import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IStaffAuthCommonPort } from '@acme-staff/contracts/staff-auth';

import { AuthGlobalSubjectCommonAdapter } from '../auth-global-subject-common.adapter';

describe('AuthGlobalSubjectCommonAdapter', () => {
  let staffAuthCore: jest.Mocked<IStaffAuthCommonPort>;
  let adapter: AuthGlobalSubjectCommonAdapter;

  beforeEach(() => {
    staffAuthCore = { handleFindSubject: jest.fn() };
    adapter = new AuthGlobalSubjectCommonAdapter(staffAuthCore);
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
