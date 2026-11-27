import type { ICachePort } from '@acme-libs/contracts/cache';

import { ProductCoreCatalogCacheAdapter } from '../product-core-catalog-cache.adapter';

describe('ProductCoreCatalogCacheAdapter', () => {
  let cache: jest.Mocked<ICachePort>;
  let adapter: ProductCoreCatalogCacheAdapter;

  beforeEach(() => {
    cache = { get: jest.fn(), delByPrefix: jest.fn(), wrap: jest.fn() };
    adapter = new ProductCoreCatalogCacheAdapter(cache);
  });

  describe('invalidate', () => {
    it('deletes every page of the customer catalog by its prefix', async () => {
      cache.delByPrefix.mockResolvedValue(2);

      await adapter.invalidate();

      expect(cache.delByPrefix).toHaveBeenCalledWith('acme:catalog:v1:');
    });

    it('lets a failed delete reject', async () => {
      cache.delByPrefix.mockRejectedValue(new Error('redis is down'));

      await expect(adapter.invalidate()).rejects.toThrow('redis is down');
    });
  });
});
