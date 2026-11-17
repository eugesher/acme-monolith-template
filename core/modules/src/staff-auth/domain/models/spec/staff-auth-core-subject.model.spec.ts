import { PermissionCodeEnum } from '@acme-libs/kernel';

import { StaffAuthCoreSubjectModel } from '../staff-auth-core-subject.model';

describe('StaffAuthCoreSubjectModel', () => {
  describe('reconstitute', () => {
    it('restores the user with its roles and the distinct codes of their permissions in order', () => {
      const subject = StaffAuthCoreSubjectModel.reconstitute({
        id: 'user-1',
        email: 'viewer@example.com',
        userRoles: [
          {
            role: {
              name: 'viewer',
              rolePermissions: [
                { code: PermissionCodeEnum.ORDER_READ },
                { code: PermissionCodeEnum.LEDGER_READ },
              ],
            },
          },
          {
            role: {
              name: 'editor',
              rolePermissions: [{ code: PermissionCodeEnum.LEDGER_READ }],
            },
          },
        ],
      });

      expect(subject).toMatchObject({
        id: 'user-1',
        email: 'viewer@example.com',
        roles: ['editor', 'viewer'],
        permissionCodes: ['ledger:read', 'order:read'],
      });
    });

    it('restores a user without roles with no permissions', () => {
      const subject = StaffAuthCoreSubjectModel.reconstitute({
        id: 'user-1',
        email: 'viewer@example.com',
        userRoles: [],
      });

      expect(subject).toMatchObject({ roles: [], permissionCodes: [] });
    });
  });

  describe('toSnapshot', () => {
    it('answers the subject with copies of its roles and permission codes', () => {
      const subject = StaffAuthCoreSubjectModel.reconstitute({
        id: 'user-1',
        email: 'editor@example.com',
        userRoles: [
          { role: { name: 'editor', rolePermissions: [{ code: PermissionCodeEnum.LEDGER_READ }] } },
        ],
      });

      expect(subject.toSnapshot()).toEqual({
        id: 'user-1',
        email: 'editor@example.com',
        roles: ['editor'],
        permissionCodes: ['ledger:read'],
      });
    });
  });
});
