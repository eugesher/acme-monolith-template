import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  UserRegisterStaffUserInsertOutcomeEnum,
  type IUserCredentialsPort,
  type IUserRegisterRepositoryPort,
  type IUserTransactionPort,
} from '../../../outbound';
import { UserRegisterUseCase } from '../user-register.use-case';

describe('UserRegisterUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IUserRegisterRepositoryPort>;
  let transaction: jest.Mocked<IUserTransactionPort>;
  let credentials: jest.Mocked<IUserCredentialsPort>;
  let logger: PinoLoggerMock;
  let useCase: UserRegisterUseCase;

  beforeEach(() => {
    calls = [];
    repository = { insertUser: jest.fn(), findMany: jest.fn(), insertUserRoles: jest.fn() };
    repository.insertUser.mockImplementation(() => {
      calls.push('insertUser');

      return Promise.resolve({
        outcome: UserRegisterStaffUserInsertOutcomeEnum.INSERTED,
        id: '5',
      });
    });
    repository.findMany.mockImplementation(() => {
      calls.push('findMany');

      return Promise.resolve([{ id: '2' }]);
    });
    repository.insertUserRoles.mockImplementation(() => {
      calls.push('insertUserRoles');

      return Promise.resolve();
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    credentials = { hashPassword: jest.fn() };
    credentials.hashPassword.mockImplementation(() => {
      calls.push('hashPassword');

      return Promise.resolve('argon-hash');
    });
    logger = makePinoLoggerMock();
    useCase = new UserRegisterUseCase(repository, transaction, credentials, logger);
  });

  it('hashes the password and stores the user with its roles in one transaction', async () => {
    const view = await useCase.execute({
      email: 'Editor@Example.com',
      password: 'correct-horse-battery',
      roleIds: ['2'],
    });

    expect(view).toEqual({ id: '5', email: 'editor@example.com' });
    expect(credentials.hashPassword).toHaveBeenCalledWith('correct-horse-battery');
    expect(repository.insertUser).toHaveBeenCalledWith({
      email: 'editor@example.com',
      passwordHash: 'argon-hash',
      status: 'active',
    });
    expect(repository.findMany).toHaveBeenCalledWith(['2']);
    expect(repository.insertUserRoles).toHaveBeenCalledWith([{ userId: '5', roleId: '2' }]);
    expect(calls).toEqual([
      'hashPassword',
      'begin',
      'insertUser',
      'findMany',
      'insertUserRoles',
      'commit',
    ]);
    expect(logger.info).toHaveBeenCalledWith({ id: '5' }, 'User registered');
  });

  it('refuses a role that is not stored and rolls the transaction back', async () => {
    const register = useCase.execute({
      email: 'editor@example.com',
      password: 'correct-horse-battery',
      roleIds: ['2', '99'],
    });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
      message: 'Role 99 was not found',
    });
    expect(calls).toEqual(['hashPassword', 'begin', 'insertUser', 'findMany']);
  });

  it('rejects a weak password before hashing it', async () => {
    const register = useCase.execute({
      email: 'editor@example.com',
      password: 'short',
      roleIds: [],
    });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
    });
    expect(credentials.hashPassword).not.toHaveBeenCalled();
  });

  it('rejects a malformed email before opening the transaction', async () => {
    const register = useCase.execute({
      email: 'not-an-email',
      password: 'correct-horse-battery',
      roleIds: [],
    });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
    });
    expect(transaction.run).not.toHaveBeenCalled();
  });

  it('refuses a duplicate email of the repository as taken and rolls the transaction back', async () => {
    repository.insertUser.mockResolvedValue({
      outcome: UserRegisterStaffUserInsertOutcomeEnum.DUPLICATE,
    });

    const register = useCase.execute({
      email: 'editor@example.com',
      password: 'correct-horse-battery',
      roleIds: [],
    });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN,
      message: 'Email is already registered',
    });
    expect(calls).not.toContain('commit');
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('passes a failing insert through as is and rolls the transaction back', async () => {
    repository.insertUser.mockRejectedValue(new Error('deadlock'));

    const register = useCase.execute({
      email: 'editor@example.com',
      password: 'correct-horse-battery',
      roleIds: [],
    });

    await expect(register).rejects.toThrow('deadlock');
    expect(calls).not.toContain('commit');
  });

  it('rolls the transaction back when the roles fail to store', async () => {
    repository.insertUserRoles.mockRejectedValue(new Error('deadlock'));

    const register = useCase.execute({
      email: 'editor@example.com',
      password: 'correct-horse-battery',
      roleIds: ['2'],
    });

    await expect(register).rejects.toThrow('deadlock');
    expect(calls).not.toContain('commit');
    expect(logger.info).not.toHaveBeenCalled();
  });
});
