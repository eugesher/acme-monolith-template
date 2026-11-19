import { IdentityExceptionCodeEnum, PermissionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  RoleCreateStaffRoleInsertOutcomeEnum,
  type IRoleCreateRepositoryPort,
  type IRoleTransactionPort,
} from '../../../outbound';
import { RoleCreateUseCase } from '../role-create.use-case';

describe('RoleCreateUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IRoleCreateRepositoryPort>;
  let transaction: jest.Mocked<IRoleTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: RoleCreateUseCase;

  beforeEach(() => {
    calls = [];
    repository = { insertRole: jest.fn(), insertRolePermissions: jest.fn() };
    repository.insertRole.mockImplementation(() => {
      calls.push('insertRole');

      return Promise.resolve({ outcome: RoleCreateStaffRoleInsertOutcomeEnum.INSERTED, id: '7' });
    });
    repository.insertRolePermissions.mockImplementation(() => {
      calls.push('insertRolePermissions');

      return Promise.resolve();
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();
    useCase = new RoleCreateUseCase(repository, transaction, logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stores the role with its unique permission codes in one transaction', async () => {
    const view = await useCase.execute({
      name: 'auditor',
      permissionCodes: [
        PermissionCodeEnum.LEDGER_READ,
        PermissionCodeEnum.ORDER_READ,
        PermissionCodeEnum.LEDGER_READ,
      ],
    });

    expect(view).toEqual({
      id: '7',
      name: 'auditor',
      permissionCodes: ['ledger:read', 'order:read'],
    });
    expect(repository.insertRole).toHaveBeenCalledWith({ name: 'auditor' });
    expect(repository.insertRolePermissions).toHaveBeenCalledWith([
      { roleId: '7', code: 'ledger:read' },
      { roleId: '7', code: 'order:read' },
    ]);
    expect(calls).toEqual(['begin', 'insertRole', 'insertRolePermissions', 'commit']);
    expect(logger.info).toHaveBeenCalledWith({ id: '7' }, 'Role created');
  });

  it('stores a role without permissions', async () => {
    const view = await useCase.execute({ name: 'auditor', permissionCodes: [] });

    expect(view).toEqual({ id: '7', name: 'auditor', permissionCodes: [] });
    expect(repository.insertRolePermissions).toHaveBeenCalledWith([]);
  });

  it('refuses a taken name and rolls the transaction back', async () => {
    repository.insertRole.mockResolvedValue({
      outcome: RoleCreateStaffRoleInsertOutcomeEnum.DUPLICATE,
    });

    const create = useCase.execute({ name: 'admin', permissionCodes: [] });

    await expect(create).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_ROLE_NAME_TAKEN,
      message: 'Role name admin is already taken',
    });
    expect(calls).not.toContain('commit');
    expect(repository.insertRolePermissions).not.toHaveBeenCalled();
  });

  it('rethrows any other error of the repository', async () => {
    const failure = new Error('connection lost');
    repository.insertRole.mockRejectedValue(failure);

    const create = useCase.execute({ name: 'auditor', permissionCodes: [] });

    await expect(create).rejects.toBe(failure);
  });

  it('rolls the transaction back when the permissions fail to store', async () => {
    repository.insertRolePermissions.mockRejectedValue(new Error('deadlock'));

    const create = useCase.execute({
      name: 'auditor',
      permissionCodes: [PermissionCodeEnum.LEDGER_READ],
    });

    await expect(create).rejects.toThrow('deadlock');
    expect(calls).not.toContain('commit');
    expect(logger.info).not.toHaveBeenCalled();
  });
});
