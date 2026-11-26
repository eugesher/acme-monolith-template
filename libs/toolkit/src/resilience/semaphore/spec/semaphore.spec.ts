import { Semaphore } from '../semaphore';

describe('Semaphore', () => {
  let semaphore: Semaphore;

  beforeEach(() => {
    jest.useFakeTimers();

    semaphore = new Semaphore({
      maxConcurrency: 1,
      queueTimeoutMs: 1000,
      onQueueTimeout: () => new Error('Too many tasks at once'),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('runs a task at once while a slot is free and returns its result', async () => {
    const result = await semaphore.run(() => Promise.resolve('hashed'));

    expect(result).toBe('hashed');
  });

  it('holds a task beyond maxConcurrency until a running one settles', async () => {
    let finishFirst: (value: string) => void = () => undefined;
    const second = jest.fn(() => Promise.resolve('second'));
    const first = semaphore.run(
      () =>
        new Promise<string>((resolve) => {
          finishFirst = resolve;
        }),
    );
    const queued = semaphore.run(second);

    await Promise.resolve();

    expect(second).not.toHaveBeenCalled();

    finishFirst('first');

    await expect(first).resolves.toBe('first');
    await expect(queued).resolves.toBe('second');
  });

  it('frees the slot of a task that throws', async () => {
    const failed = semaphore.run(() => Promise.reject(new Error('task failed')));

    await expect(failed).rejects.toThrow('task failed');
    await expect(semaphore.run(() => Promise.resolve('next'))).resolves.toBe('next');
  });

  it('rejects with the error of onQueueTimeout a task that waits longer than queueTimeoutMs and drops it from the queue', async () => {
    let finishFirst: (value: string) => void = () => undefined;
    const late = jest.fn(() => Promise.resolve('late'));
    const first = semaphore.run(
      () =>
        new Promise<string>((resolve) => {
          finishFirst = resolve;
        }),
    );
    const timedOut = semaphore.run(late);

    jest.advanceTimersByTime(1000);

    await expect(timedOut).rejects.toEqual(new Error('Too many tasks at once'));

    finishFirst('first');

    await expect(first).resolves.toBe('first');
    await expect(semaphore.run(() => Promise.resolve('next'))).resolves.toBe('next');
    expect(late).not.toHaveBeenCalled();
  });
});
