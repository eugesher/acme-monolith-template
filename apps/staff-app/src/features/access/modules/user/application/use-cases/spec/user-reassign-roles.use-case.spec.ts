import type { PinoLogger } from 'nestjs-pino';

import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { UserReassignRolesUseCase } from '../user-reassign-roles.use-case';

describe('UserReassignRolesUseCase', () => {
  let calls: string[];
  let repository: {
    existsUser: jest.Mock;
    findRoles: jest.Mock;
    deleteUserRolesExcept: jest.Mock;
    insertUserRolesIgnore: jest.Mock;
  };
  let transaction: { run: jest.Mock };
  let logger: PinoLoggerMock;
  let useCase: UserReassignRolesUseCase;

  beforeEach(() => {
    calls = [];
    repository = {
      existsUser: jest.fn(() => {
        calls.push('existsUser');

        return Promise.resolve(true);
      }),
      findRoles: jest.fn(() => {
        calls.push('findRoles');

        return Promise.resolve([{ id: '2' }, { id: '3' }]);
      }),
      deleteUserRolesExcept: jest.fn(() => {
        calls.push('deleteUserRolesExcept');

        return Promise.resolve();
      }),
      insertUserRolesIgnore: jest.fn(() => {
        calls.push('insertUserRolesIgnore');

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
    useCase = new UserReassignRolesUseCase(
      repository,
      transaction,
      logger as unknown as PinoLogger,
    );
  });

  it('deletes the other roles and inserts the given ones in one transaction', async () => {
    const view = await useCase.execute({ userId: 'user-1', roleIds: ['2', '3'] });

    expect(view).toEqual({ id: 'user-1', roleIds: ['2', '3'] });
    expect(repository.deleteUserRolesExcept).toHaveBeenCalledWith({
      userId: 'user-1',
      roleIds: ['2', '3'],
    });
    expect(repository.insertUserRolesIgnore).toHaveBeenCalledWith([
      { userId: 'user-1', roleId: '2' },
      { userId: 'user-1', roleId: '3' },
    ]);
    expect(calls).toEqual([
      'existsUser',
      'findRoles',
      'begin',
      'deleteUserRolesExcept',
      'insertUserRolesIgnore',
      'commit',
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      { id: 'user-1', userRoles: [{ roleId: '2' }, { roleId: '3' }] },
      'Roles reassigned',
    );
  });

  it('rejects an unknown user and opens no transaction', async () => {
    repository.existsUser.mockResolvedValue(false);

    const reassign = useCase.execute({ userId: 'ghost', roleIds: ['2'] });

    await expect(reassign).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_USER_NOT_FOUND,
    });
    expect(transaction.run).not.toHaveBeenCalled();
  });

  it('rejects a role that is not stored and opens no transaction', async () => {
    const reassign = useCase.execute({ userId: 'user-1', roleIds: ['2', '99'] });

    await expect(reassign).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
      message: 'Role 99 was not found',
    });
    expect(calls).toEqual(['existsUser', 'findRoles']);
  });

  it('clears the roles with an empty list', async () => {
    const view = await useCase.execute({ userId: 'user-1', roleIds: [] });

    expect(view).toEqual({ id: 'user-1', roleIds: [] });
    expect(repository.deleteUserRolesExcept).toHaveBeenCalledWith({
      userId: 'user-1',
      roleIds: [],
    });
    expect(repository.insertUserRolesIgnore).toHaveBeenCalledWith([]);
  });
});
