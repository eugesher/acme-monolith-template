import type { ICachePort } from '@acme-libs/contracts/cache';

import { CatalogCacheAdapter } from '../catalog-cache.adapter';

describe('CatalogCacheAdapter', () => {
  let cache: jest.Mocked<ICachePort>;
  let adapter: CatalogCacheAdapter;

  beforeEach(() => {
    cache = { handleGet: jest.fn(), handleDelByPrefix: jest.fn(), handleWrap: jest.fn() };
    adapter = new CatalogCacheAdapter(cache);
  });

  describe('read', () => {
    it('reads the page window through the cache under its key and TTL', async () => {
      const compute = jest.fn();
      cache.handleWrap.mockResolvedValue({ page: 2, count: 0, pageCount: 0, total: 0, data: [] });

      const page = await adapter.read({ page: 2, limit: 10, ttlMs: 60_000, compute });

      expect(page).toEqual({ page: 2, count: 0, pageCount: 0, total: 0, data: [] });
      expect(cache.handleWrap).toHaveBeenCalledWith({
        key: 'acme:catalog:v1:page:2:limit:10',
        ttlMs: 60_000,
        compute,
      });
      expect(compute).not.toHaveBeenCalled();
    });
  });
});
