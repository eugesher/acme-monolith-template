import type { ICacheLibPort } from '@acme-libs/contracts/cache';

import { ProductCatalogCacheAdapter } from '../product-catalog-cache.adapter';

describe('ProductCatalogCacheAdapter', () => {
  let cache: jest.Mocked<ICacheLibPort>;
  let adapter: ProductCatalogCacheAdapter;

  beforeEach(() => {
    cache = { handleGet: jest.fn(), handleDelByPrefix: jest.fn(), handleWrap: jest.fn() };
    adapter = new ProductCatalogCacheAdapter(cache);
  });

  describe('invalidate', () => {
    it('deletes every page of the customer catalog by its prefix', async () => {
      cache.handleDelByPrefix.mockResolvedValue(2);

      await adapter.invalidate();

      expect(cache.handleDelByPrefix).toHaveBeenCalledWith('acme:catalog:v1:');
    });

    it('lets a failed delete reject', async () => {
      cache.handleDelByPrefix.mockRejectedValue(new Error('redis is down'));

      await expect(adapter.invalidate()).rejects.toThrow('redis is down');
    });
  });
});
