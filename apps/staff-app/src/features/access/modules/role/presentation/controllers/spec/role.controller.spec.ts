import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleController } from '../role.controller';
import type {
  RoleCreateUseCase,
  RoleListUseCase,
  RoleReassignPermissionsUseCase,
} from '../../../application';

describe('RoleController', () => {
  let list: jest.Mocked<Pick<RoleListUseCase, 'execute'>>;
  let create: jest.Mocked<Pick<RoleCreateUseCase, 'execute'>>;
  let reassignPermissions: jest.Mocked<Pick<RoleReassignPermissionsUseCase, 'execute'>>;
  let controller: RoleController;

  beforeEach(() => {
    list = { execute: jest.fn() };
    create = { execute: jest.fn() };
    reassignPermissions = { execute: jest.fn() };

    controller = new RoleController(
      list as unknown as RoleListUseCase,
      create as unknown as RoleCreateUseCase,
      reassignPermissions as unknown as RoleReassignPermissionsUseCase,
    );
  });

  describe('handleList', () => {
    it('answers the roles', async () => {
      list.execute.mockResolvedValue([{ id: '3', name: 'viewer', permissionCodes: [] }]);

      const response = await controller.handleList();

      expect(response).toEqual([{ id: '3', name: 'viewer', permissionCodes: [] }]);
    });
  });

  describe('handleCreate', () => {
    it('creates the role from the body and answers it', async () => {
      create.execute.mockResolvedValue({ id: '7', name: 'auditor', permissionCodes: [] });

      const response = await controller.handleCreate({ name: 'auditor', permissionCodes: [] });

      expect(response).toEqual({ id: '7', name: 'auditor', permissionCodes: [] });
      expect(create.execute).toHaveBeenCalledWith({ name: 'auditor', permissionCodes: [] });
    });
  });

  describe('handleReassignPermissions', () => {
    it('reassigns the permissions of the role of the path with the codes of the body', async () => {
      reassignPermissions.execute.mockResolvedValue({
        id: '3',
        name: 'viewer',
        permissionCodes: [PermissionCodeEnum.ACCESS_MANAGE],
      });

      const response = await controller.handleReassignPermissions(
        { roleId: '3' },
        {
          permissionCodes: [PermissionCodeEnum.ACCESS_MANAGE],
        },
      );

      expect(response).toEqual({
        id: '3',
        name: 'viewer',
        permissionCodes: ['access:manage'],
      });
      expect(reassignPermissions.execute).toHaveBeenCalledWith({
        roleId: '3',
        permissionCodes: ['access:manage'],
      });
    });
  });
});
