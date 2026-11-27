import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { LocalStorageTransactionalRunCase } from '../local-storage-transactional-run.case';
import type {
  ILocalStorageTransactionalContextPort,
  ILocalStorageTransactionalHostPort,
} from '../../../outbound';

describe('LocalStorageTransactionalRunCase', () => {
  let host: jest.Mocked<ILocalStorageTransactionalHostPort>;
  let context: jest.Mocked<ILocalStorageTransactionalContextPort>;
  let logger: PinoLoggerMock;
  let runCase: LocalStorageTransactionalRunCase;

  beforeEach(() => {
    host = { isActive: jest.fn(), withTransaction: jest.fn() };
    host.isActive.mockReturnValue(false);
    host.withTransaction.mockImplementation((work) => work());
    context = { run: jest.fn(), setHooks: jest.fn(), getHooks: jest.fn() };
    context.run.mockImplementation((work) => work());
    logger = makePinoLoggerMock();
    runCase = new LocalStorageTransactionalRunCase(host, context, logger);
  });

  it('joins the open transaction without a context or hooks of its own', async () => {
    host.isActive.mockReturnValue(true);

    const result = await runCase.execute(() => Promise.resolve('done'));

    expect(result).toBe('done');
    expect(host.withTransaction).toHaveBeenCalledTimes(1);
    expect(context.run).not.toHaveBeenCalled();
    expect(context.setHooks).not.toHaveBeenCalled();
  });

  it('opens a context with fresh hooks for the outermost run and runs them after the work', async () => {
    const outcomes: string[] = [];
    context.setHooks.mockImplementation((hooks) => {
      hooks.push(() => Promise.resolve(void outcomes.push('hook')));
    });

    await expect(
      runCase.execute(() => Promise.resolve(void outcomes.push('work'))),
    ).resolves.toBeUndefined();

    expect(context.run).toHaveBeenCalledTimes(1);
    expect(outcomes).toEqual(['work', 'hook']);
  });

  it('runs the hooks one after another and answers after the last one', async () => {
    const outcomes: string[] = [];
    context.setHooks.mockImplementation((hooks) => {
      hooks.push(async () => {
        await Promise.resolve();
        outcomes.push('hook 1');
      });
      hooks.push(() => Promise.resolve(void outcomes.push('hook 2')));
    });

    await runCase.execute(() => Promise.resolve());

    expect(outcomes).toEqual(['hook 1', 'hook 2']);
  });

  it('logs a failed hook and runs the rest', async () => {
    const outcomes: string[] = [];
    context.setHooks.mockImplementation((hooks) => {
      hooks.push(() => Promise.reject(new Error('cache is down')));
      hooks.push(() => Promise.resolve(void outcomes.push('hook 2')));
    });

    await runCase.execute(() => Promise.resolve());

    expect(outcomes).toEqual(['hook 2']);
    expect(logger.error).toHaveBeenCalledWith(
      { err: new Error('cache is down') },
      'After-commit hook failed',
    );
  });
});
