import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleModel } from '../role.model';

describe('RoleModel', () => {
  let role: RoleModel;

  beforeEach(() => {
    role = RoleModel.reconstitute({
      id: '2',
      name: 'editor',
      rolePermissions: [{ code: PermissionCodeEnum.ACCESS_MANAGEMENT }],
    });
  });

  describe('reconstitute', () => {
    it('keeps the stored state as is', () => {
      expect(role).toMatchObject({
        id: '2',
        name: 'editor',
        permissionCodes: ['access-management'],
      });
    });
  });

  describe('getRolePermissions', () => {
    it('answers a row of the role for every permission code', () => {
      expect(role.getRolePermissions()).toEqual([{ roleId: '2', code: 'access-management' }]);
    });
  });

  describe('toReassignPermissionsLoggerPayload', () => {
    it('answers the name of the role and its permissions', () => {
      expect(role.toReassignPermissionsLoggerPayload()).toEqual({
        name: 'editor',
        rolePermissions: [{ code: 'access-management' }],
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

      expect(role.permissionCodes).toEqual(['access-management', 'product:read']);
    });

    it('clears the codes with an empty list', () => {
      role.reassignPermissions([]);

      expect(role.permissionCodes).toEqual([]);
    });
  });

  describe('toSnapshot', () => {
    it('copies the name and the permission codes of the role', () => {
      const role = RoleModel.reconstitute({
        id: '1',
        name: 'admin',
        rolePermissions: [
          { code: PermissionCodeEnum.ACCESS_MANAGEMENT },
          { code: PermissionCodeEnum.LEDGER_READ },
        ],
      });

      const view = role.toSnapshot();

      expect(view).toEqual({
        id: '1',
        name: 'admin',
        permissionCodes: ['access-management', 'ledger:read'],
      });
    });
  });
});
