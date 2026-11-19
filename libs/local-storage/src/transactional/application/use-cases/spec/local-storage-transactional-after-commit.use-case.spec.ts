import { LocalStorageTransactionalAfterCommitUseCase } from '../local-storage-transactional-after-commit.use-case';
import type {
  ILocalStorageTransactionalContextPort,
  ILocalStorageTransactionalHostPort,
} from '../../../outbound';

describe('LocalStorageTransactionalAfterCommitUseCase', () => {
  let host: jest.Mocked<ILocalStorageTransactionalHostPort>;
  let context: jest.Mocked<ILocalStorageTransactionalContextPort>;
  let useCase: LocalStorageTransactionalAfterCommitUseCase;

  beforeEach(() => {
    host = { isActive: jest.fn(), withTransaction: jest.fn() };
    host.isActive.mockReturnValue(true);
    context = { run: jest.fn(), setHooks: jest.fn(), getHooks: jest.fn() };
    context.getHooks.mockReturnValue([]);
    useCase = new LocalStorageTransactionalAfterCommitUseCase(host, context);
  });

  it('adds the hook to the hooks of the open run', () => {
    const hooks: (() => Promise<void>)[] = [];
    const hook = (): Promise<void> => Promise.resolve();
    context.getHooks.mockReturnValue(hooks);

    useCase.execute(hook);

    expect(hooks).toEqual([hook]);
  });

  it('refuses a hook while no transaction is open', () => {
    host.isActive.mockReturnValue(false);

    expect(() => useCase.execute(() => Promise.resolve())).toThrow(
      'afterCommit must be called inside TRANSACTION_PORT.run',
    );
  });

  it('refuses a hook when the run holds no hooks', () => {
    context.getHooks.mockReturnValue(undefined);

    expect(() => useCase.execute(() => Promise.resolve())).toThrow(
      'afterCommit must be called inside TRANSACTION_PORT.run',
    );
  });
});
