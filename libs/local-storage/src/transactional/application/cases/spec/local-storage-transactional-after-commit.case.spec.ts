import { LocalStorageTransactionalAfterCommitCase } from '../local-storage-transactional-after-commit.case';
import type {
  ILocalStorageTransactionalContextPort,
  ILocalStorageTransactionalHostPort,
} from '../../../outbound';

describe('LocalStorageTransactionalAfterCommitCase', () => {
  let host: jest.Mocked<ILocalStorageTransactionalHostPort>;
  let context: jest.Mocked<ILocalStorageTransactionalContextPort>;
  let afterCommitCase: LocalStorageTransactionalAfterCommitCase;

  beforeEach(() => {
    host = { isActive: jest.fn(), withTransaction: jest.fn() };
    host.isActive.mockReturnValue(true);
    context = { run: jest.fn(), setHooks: jest.fn(), getHooks: jest.fn() };
    context.getHooks.mockReturnValue([]);
    afterCommitCase = new LocalStorageTransactionalAfterCommitCase(host, context);
  });

  it('adds the hook to the hooks of the open run', () => {
    const hooks: (() => Promise<void>)[] = [];
    const hook = (): Promise<void> => Promise.resolve();
    context.getHooks.mockReturnValue(hooks);

    afterCommitCase.execute(hook);

    expect(hooks).toEqual([hook]);
  });

  it('refuses a hook while no transaction is open', () => {
    host.isActive.mockReturnValue(false);

    expect(() => afterCommitCase.execute(() => Promise.resolve())).toThrow(
      'afterCommit must be called inside TRANSACTION_PORT.run',
    );
  });

  it('refuses a hook when the run holds no hooks', () => {
    context.getHooks.mockReturnValue(undefined);

    expect(() => afterCommitCase.execute(() => Promise.resolve())).toThrow(
      'afterCommit must be called inside TRANSACTION_PORT.run',
    );
  });
});
