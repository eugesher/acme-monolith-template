import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { CacheDelByPrefixCase } from '../cache-del-by-prefix.case';
import type { ICacheStorePort, ICacheTracerPort, ICacheTracerSpanCommand } from '../../../outbound';

describe('CacheDelByPrefixCase', () => {
  let store: jest.Mocked<ICacheStorePort>;
  let spans: { name: string; attributes: ICacheTracerSpanCommand<unknown>['attributes'] }[];
  let logger: PinoLoggerMock;
  let delByPrefixCase: CacheDelByPrefixCase;

  beforeEach(() => {
    store = { get: jest.fn(), set: jest.fn(), unlinkByPrefix: jest.fn() };
    store.unlinkByPrefix.mockResolvedValue(2);
    spans = [];
    logger = makePinoLoggerMock();
    delByPrefixCase = new CacheDelByPrefixCase(
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

  it('unlinks the keys under the prefix and counts them on the span', async () => {
    const unlinked = await delByPrefixCase.execute('acme:r:1:');

    expect(unlinked).toBe(2);
    expect(store.unlinkByPrefix).toHaveBeenCalledWith('acme:r:1:');
    expect(spans).toEqual([
      {
        name: 'cache.delByPrefix',
        attributes: { 'cache.prefix': 'acme:r:1:', 'cache.keys_unlinked': 2 },
      },
    ]);
  });

  it('logs a failed invalidation and returns 0 instead of failing the caller', async () => {
    store.unlinkByPrefix.mockRejectedValue(new Error('scan failed'));

    const unlinked = await delByPrefixCase.execute('acme:r:1:');

    expect(unlinked).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith(
      { err: new Error('scan failed'), prefix: 'acme:r:1:' },
      'Cache invalidation failed, entries expire on TTL',
    );
    expect(spans).toEqual([
      {
        name: 'cache.delByPrefix',
        attributes: { 'cache.prefix': 'acme:r:1:', 'cache.error': 'unlink' },
      },
    ]);
  });
});
