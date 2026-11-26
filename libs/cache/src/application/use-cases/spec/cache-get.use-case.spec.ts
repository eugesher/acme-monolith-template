import { CacheGetUseCase } from '../cache-get.use-case';
import type { ICacheStorePort, ICacheTracerPort, ICacheTracerSpanCommand } from '../../../outbound';

describe('CacheGetUseCase', () => {
  let store: jest.Mocked<ICacheStorePort>;
  let spans: { name: string; attributes: ICacheTracerSpanCommand<unknown>['attributes'] }[];
  let useCase: CacheGetUseCase;

  beforeEach(() => {
    store = { get: jest.fn(), set: jest.fn(), unlinkByPrefix: jest.fn() };
    store.get.mockResolvedValue(undefined);
    spans = [];
    useCase = new CacheGetUseCase(store, {
      span: async (command: ICacheTracerSpanCommand<unknown>) => {
        const attributes = { ...command.attributes };

        spans.push({ name: command.name, attributes });

        return await command.work(attributes);
      },
    } as ICacheTracerPort);
  });

  it('returns undefined on a miss and marks the span as a miss', async () => {
    const value = await useCase.execute('k');

    expect(value).toBeUndefined();
    expect(store.get).toHaveBeenCalledWith('k');
    expect(spans).toEqual([
      { name: 'cache.get', attributes: { 'cache.key': 'k', 'cache.hit': false } },
    ]);
  });

  it('returns the stored value on a hit and marks the span as a hit', async () => {
    store.get.mockResolvedValue({ a: 1 });

    const value = await useCase.execute('k');

    expect(value).toEqual({ a: 1 });
    expect(spans).toEqual([
      { name: 'cache.get', attributes: { 'cache.key': 'k', 'cache.hit': true } },
    ]);
  });

  it('lets a failed read reject', async () => {
    store.get.mockRejectedValue(new Error('read failed'));

    await expect(useCase.execute('k')).rejects.toThrow('read failed');
  });
});
