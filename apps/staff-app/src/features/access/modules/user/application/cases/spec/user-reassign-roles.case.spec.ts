import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { UserReassignRolesCase } from '../user-reassign-roles.case';
import type { IUserReassignRolesRepositoryPort, IUserTransactionPort } from '../../../outbound';

describe('UserReassignRolesCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IUserReassignRolesRepositoryPort>;
  let transaction: jest.Mocked<IUserTransactionPort>;
  let logger: PinoLoggerMock;
  let reassignRolesCase: UserReassignRolesCase;

  beforeEach(() => {
    calls = [];
    repository = {
      existsUser: jest.fn(),
      findMany: jest.fn(),
      deleteUserRolesExcept: jest.fn(),
      insertUserRolesIgnore: jest.fn(),
    };
    repository.existsUser.mockImplementation(() => {
      calls.push('existsUser');

      return Promise.resolve(true);
    });
    repository.findMany.mockImplementation(() => {
      calls.push('findMany');

      return Promise.resolve([{ id: '2' }, { id: '3' }]);
    });
    repository.deleteUserRolesExcept.mockImplementation(() => {
      calls.push('deleteUserRolesExcept');

      return Promise.resolve();
    });
    repository.insertUserRolesIgnore.mockImplementation(() => {
      calls.push('insertUserRolesIgnore');

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
    reassignRolesCase = new UserReassignRolesCase(repository, transaction, logger);
  });

  it('deletes the other roles and inserts the given ones in one transaction', async () => {
    const view = await reassignRolesCase.execute({ userId: 'user-1', roleIds: ['2', '3'] });

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
      'findMany',
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

    const reassign = reassignRolesCase.execute({ userId: 'ghost', roleIds: ['2'] });

    await expect(reassign).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_USER_NOT_FOUND,
    });
    expect(transaction.run).not.toHaveBeenCalled();
  });

  it('rejects a role that is not stored and opens no transaction', async () => {
    const reassign = reassignRolesCase.execute({ userId: 'user-1', roleIds: ['2', '99'] });

    await expect(reassign).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
      message: 'Role 99 was not found',
    });
    expect(calls).toEqual(['existsUser', 'findMany']);
  });

  it('clears the roles with an empty list', async () => {
    const view = await reassignRolesCase.execute({ userId: 'user-1', roleIds: [] });

    expect(view).toEqual({ id: 'user-1', roleIds: [] });
    expect(repository.deleteUserRolesExcept).toHaveBeenCalledWith({
      userId: 'user-1',
      roleIds: [],
    });
    expect(repository.insertUserRolesIgnore).toHaveBeenCalledWith([]);
  });
});
