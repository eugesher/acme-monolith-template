import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { CacheWrapUseCase } from '../cache-wrap.use-case';
import type { ICacheStorePort, ICacheTracerPort, ICacheTracerSpanCommand } from '../../../outbound';

describe('CacheWrapUseCase', () => {
  let store: jest.Mocked<ICacheStorePort>;
  let spans: { name: string; attributes: ICacheTracerSpanCommand<unknown>['attributes'] }[];
  let logger: PinoLoggerMock;
  let useCase: CacheWrapUseCase;

  beforeEach(() => {
    store = { get: jest.fn(), set: jest.fn(), unlinkByPrefix: jest.fn() };
    store.get.mockResolvedValue(undefined);
    store.set.mockResolvedValue();
    spans = [];
    logger = makePinoLoggerMock();
    useCase = new CacheWrapUseCase(
      store,
      {
        span: async (command: ICacheTracerSpanCommand<unknown>) => {
          const attributes = { ...command.attributes };

          spans.push({ name: command.name, attributes });

          return await command.work(attributes);
        },
      } as ICacheTracerPort,
      logger,
    );
  });

  it('computes on a miss and stores the value with the TTL', async () => {
    const compute = jest.fn().mockResolvedValue('30d');

    const value = await useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    expect(value).toBe('30d');
    expect(compute).toHaveBeenCalledTimes(1);
    expect(store.set).toHaveBeenCalledWith({ key: 'k', value: '30d', ttlMs: 600_000 });
    expect(spans).toEqual([
      { name: 'cache.wrap', attributes: { 'cache.key': 'k', 'cache.hit': false } },
    ]);
  });

  it('serves a hit from the cache without computing', async () => {
    store.get.mockResolvedValue('30d');
    const compute = jest.fn().mockResolvedValue('other');

    const value = await useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    expect(value).toBe('30d');
    expect(compute).not.toHaveBeenCalled();
    expect(store.set).not.toHaveBeenCalled();
    expect(spans).toEqual([
      { name: 'cache.wrap', attributes: { 'cache.key': 'k', 'cache.hit': true } },
    ]);
  });

  it.each([null, undefined])('returns a computed %p without writing it', async (empty) => {
    const compute = jest.fn().mockResolvedValue(empty);

    const value = await useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    expect(value).toBe(empty);
    expect(store.set).not.toHaveBeenCalled();
  });

  it('collapses concurrent calls for one key into one computation', async () => {
    let release: (value: string) => void = () => undefined;
    const compute = jest.fn(() => new Promise<string>((resolve) => (release = resolve)));

    const first = useCase.execute({ key: 'k', ttlMs: 600_000, compute });
    const second = useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    await new Promise(setImmediate);
    release('v');

    const values = await Promise.all([first, second]);

    expect(values).toEqual(['v', 'v']);
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('computes again once the previous computation has settled', async () => {
    const compute = jest.fn().mockResolvedValue('v');

    await useCase.execute({ key: 'k', ttlMs: 600_000, compute });
    await useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('computes without writing when the cache cannot be read, so a stalled Redis costs one timeout', async () => {
    store.get.mockRejectedValue(new Error('read failed'));

    const value = await useCase.execute({
      key: 'k',
      ttlMs: 600_000,
      compute: () => Promise.resolve('v'),
    });

    expect(value).toBe('v');
    expect(store.set).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      { err: new Error('read failed'), key: 'k' },
      'Cache read failed, computing the value without caching it',
    );
    expect(spans).toEqual([
      {
        name: 'cache.wrap',
        attributes: { 'cache.key': 'k', 'cache.hit': false, 'cache.error': 'read' },
      },
    ]);
  });

  it('returns the computed value when the cache cannot be written', async () => {
    store.set.mockRejectedValue(new Error('write failed'));

    const value = await useCase.execute({
      key: 'k',
      ttlMs: 600_000,
      compute: () => Promise.resolve('v'),
    });

    expect(value).toBe('v');
    expect(logger.warn).toHaveBeenCalledWith(
      { err: new Error('write failed'), key: 'k' },
      'Cache write failed',
    );
    expect(spans).toEqual([
      {
        name: 'cache.wrap',
        attributes: { 'cache.key': 'k', 'cache.hit': false, 'cache.error': 'write' },
      },
    ]);
  });

  it('lets a failed computation reject every waiting caller', async () => {
    const compute = jest.fn().mockRejectedValue(new Error('compute failed'));

    const first = useCase.execute({ key: 'k', ttlMs: 600_000, compute });
    const second = useCase.execute({ key: 'k', ttlMs: 600_000, compute });

    await expect(first).rejects.toThrow('compute failed');
    await expect(second).rejects.toThrow('compute failed');
    expect(compute).toHaveBeenCalledTimes(1);
  });
});
