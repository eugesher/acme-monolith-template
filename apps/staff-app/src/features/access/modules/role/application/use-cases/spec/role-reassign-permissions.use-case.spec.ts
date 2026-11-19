import type { PinoLogger } from 'nestjs-pino';

import { IdentityExceptionCodeEnum, PermissionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { RoleReassignPermissionsUseCase } from '../role-reassign-permissions.use-case';

describe('RoleReassignPermissionsUseCase', () => {
  let calls: string[];
  let repository: {
    findRole: jest.Mock;
    deleteRolePermissions: jest.Mock;
    insertRolePermissions: jest.Mock;
  };
  let transaction: { run: jest.Mock };
  let logger: PinoLoggerMock;
  let useCase: RoleReassignPermissionsUseCase;

  beforeEach(() => {
    calls = [];
    repository = {
      findRole: jest.fn(() => {
        calls.push('findRole');

        return Promise.resolve({
          id: '2',
          name: 'editor',
          rolePermissions: [{ code: PermissionCodeEnum.ACCESS_MANAGE }],
        });
      }),
      deleteRolePermissions: jest.fn(() => {
        calls.push('deleteRolePermissions');

        return Promise.resolve();
      }),
      insertRolePermissions: jest.fn(() => {
        calls.push('insertRolePermissions');

        return Promise.resolve();
      }),
    };
    transaction = {
      run: jest.fn(async (work: () => Promise<unknown>) => {
        calls.push('begin');

        const result = await work();

        calls.push('commit');

        return result;
      }),
    };
    logger = makePinoLoggerMock();
    useCase = new RoleReassignPermissionsUseCase(
      repository,
      transaction,
      logger as unknown as PinoLogger,
    );
  });

  it('reassigns the permissions of the role in one transaction', async () => {
    const view = await useCase.execute({
      roleId: '2',
      permissionCodes: [PermissionCodeEnum.ACCESS_MANAGE, PermissionCodeEnum.PRODUCT_READ],
    });

    expect(view).toEqual({
      id: '2',
      name: 'editor',
      permissionCodes: ['access:manage', 'product:read'],
    });
    expect(repository.deleteRolePermissions).toHaveBeenCalledWith('2');
    expect(repository.insertRolePermissions).toHaveBeenCalledWith([
      { roleId: '2', code: 'access:manage' },
      { roleId: '2', code: 'product:read' },
    ]);
    expect(calls).toEqual([
      'begin',
      'findRole',
      'deleteRolePermissions',
      'insertRolePermissions',
      'commit',
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      {
        name: 'editor',
        rolePermissions: [{ code: 'access:manage' }, { code: 'product:read' }],
      },
      'Role permissions reassigned',
    );
  });

  it('rejects an unknown role', async () => {
    repository.findRole.mockResolvedValue(null);

    const reassign = useCase.execute({ roleId: '1', permissionCodes: [] });

    await expect(reassign).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
      message: 'Role 1 was not found',
    });
    expect(repository.deleteRolePermissions).not.toHaveBeenCalled();
  });

  it('rolls the transaction back without inserting when the old permissions fail to delete', async () => {
    repository.deleteRolePermissions.mockRejectedValue(new Error('deadlock'));

    const reassign = useCase.execute({
      roleId: '2',
      permissionCodes: [PermissionCodeEnum.PRODUCT_READ],
    });

    await expect(reassign).rejects.toThrow('deadlock');
    expect(repository.insertRolePermissions).not.toHaveBeenCalled();
    expect(calls).not.toContain('commit');
  });
});
