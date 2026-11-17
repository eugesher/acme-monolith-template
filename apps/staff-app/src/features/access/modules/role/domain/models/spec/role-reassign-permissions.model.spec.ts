import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleReassignPermissionsModel } from '../role-reassign-permissions.model';

describe('RoleReassignPermissionsModel', () => {
  let role: RoleReassignPermissionsModel;

  beforeEach(() => {
    role = RoleReassignPermissionsModel.reconstitute({
      id: '2',
      name: 'editor',
      rolePermissions: [
        { code: PermissionCodeEnum.LEDGER_READ },
        { code: PermissionCodeEnum.ACCESS_MANAGEMENT },
      ],
    });
  });

  describe('reconstitute', () => {
    it('sorts the permission codes of the stored rows', () => {
      expect(role.toSnapshot()).toEqual({
        id: '2',
        name: 'editor',
        permissionCodes: ['access-management', 'ledger:read'],
      });
    });
  });

  describe('reassignPermissions', () => {
    it('reassigns the codes, without duplicates', () => {
      role.reassignPermissions([
        PermissionCodeEnum.ACCESS_MANAGEMENT,
        PermissionCodeEnum.PRODUCT_READ,
        PermissionCodeEnum.ACCESS_MANAGEMENT,
      ]);

      expect(role.toSnapshot()).toMatchObject({
        permissionCodes: ['access-management', 'product:read'],
      });
    });

    it('clears the codes with an empty list', () => {
      role.reassignPermissions([]);

      expect(role.toSnapshot()).toMatchObject({ permissionCodes: [] });
    });
  });

  describe('getRolePermissions', () => {
    it('answers a row of the role for every permission code', () => {
      expect(role.getRolePermissions()).toEqual([
        { roleId: '2', code: 'access-management' },
        { roleId: '2', code: 'ledger:read' },
      ]);
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the name of the role and its permissions', () => {
      expect(role.toLoggerPayload()).toEqual({
        name: 'editor',
        rolePermissions: [{ code: 'access-management' }, { code: 'ledger:read' }],
      });
    });
  });
});
