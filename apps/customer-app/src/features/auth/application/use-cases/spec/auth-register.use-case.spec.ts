import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  AuthRegisterCustomerInsertOutcomeEnum,
  type IAuthCredentialsPort,
  type IAuthLedgerPort,
  type IAuthRegisterRepositoryPort,
} from '../../../outbound';
import { AuthRegisterUseCase } from '../auth-register.use-case';

describe('AuthRegisterUseCase', () => {
  let ledger: jest.Mocked<IAuthLedgerPort>;
  let repository: jest.Mocked<IAuthRegisterRepositoryPort>;
  let credentials: jest.Mocked<IAuthCredentialsPort>;
  let logger: PinoLoggerMock;
  let useCase: AuthRegisterUseCase;

  beforeEach(() => {
    ledger = { recordRegistered: jest.fn() };
    ledger.recordRegistered.mockResolvedValue(undefined);
    repository = { insert: jest.fn() };
    repository.insert.mockResolvedValue({
      outcome: AuthRegisterCustomerInsertOutcomeEnum.INSERTED,
      id: '105',
      createdAt: new Date('2026-01-05T08:00:00.000Z'),
    });
    credentials = {
      issueAccessToken: jest.fn(),
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
    };
    credentials.hashPassword.mockResolvedValue('argon-hash');
    logger = makePinoLoggerMock();
    useCase = new AuthRegisterUseCase(repository, credentials, ledger, logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hashes the password and stores an active customer', async () => {
    const view = await useCase.execute({
      email: 'Eve@Example.com',
      password: 'correct-horse-battery',
    });

    expect(view).toEqual({ id: '105', email: 'eve@example.com' });
    expect(credentials.hashPassword).toHaveBeenCalledWith('correct-horse-battery');
    expect(repository.insert).toHaveBeenCalledWith({
      email: 'eve@example.com',
      passwordHash: 'argon-hash',
      status: 'active',
    });
    expect(logger.info).toHaveBeenCalledWith({ id: '105' }, 'Customer registered');
  });

  it('rejects a weak password before hashing it', async () => {
    const register = useCase.execute({ email: 'eve@example.com', password: 'short' });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
    });
    expect(credentials.hashPassword).not.toHaveBeenCalled();
  });

  it('rejects a malformed email before storing anything', async () => {
    const register = useCase.execute({ email: 'not-an-email', password: 'correct-horse-battery' });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
    });
    expect(repository.insert).not.toHaveBeenCalled();
  });

  it('refuses a duplicate email of the repository as taken without logging a sign-up', async () => {
    repository.insert.mockResolvedValue({
      outcome: AuthRegisterCustomerInsertOutcomeEnum.DUPLICATE,
    });

    const register = useCase.execute({
      email: 'ann@example.com',
      password: 'correct-horse-battery',
    });

    await expect(register).rejects.toMatchObject({
      code: IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN,
      message: 'Email is already registered',
    });
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('records the registered customer in the ledger', async () => {
    await useCase.execute({ email: 'Eve@Example.com', password: 'correct-horse-battery' });

    expect(ledger.recordRegistered).toHaveBeenCalledWith({
      subjectId: '105',
      occurredAt: '2026-01-05T08:00:00.000Z',
    });
  });

  it('lets a failed ledger record reject', async () => {
    ledger.recordRegistered.mockRejectedValue(new Error('redis is down'));

    const register = useCase.execute({
      email: 'eve@example.com',
      password: 'correct-horse-battery',
    });

    await expect(register).rejects.toThrow('redis is down');
  });

  it('records nothing when the customer is refused', async () => {
    repository.insert.mockRejectedValue(new Error('Email eve@example.com is already registered'));

    const execution = useCase.execute({
      email: 'eve@example.com',
      password: 'correct-horse-battery',
    });

    await expect(execution).rejects.toThrow('Email eve@example.com is already registered');
    expect(ledger.recordRegistered).not.toHaveBeenCalled();
  });
});
