import { CatalogProductListCase } from '../catalog-product-list.case';
import type { ICatalogCachePort, ICatalogProductListRepositoryPort } from '../../../outbound';

describe('CatalogProductListCase', () => {
  let repository: jest.Mocked<ICatalogProductListRepositoryPort>;
  let cache: jest.Mocked<ICatalogCachePort>;
  let productListCase: CatalogProductListCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    cache = { read: jest.fn() };
    cache.read.mockImplementation((query) => query.compute());
    productListCase = new CatalogProductListCase(repository, cache, 60_000);
  });

  describe('execute', () => {
    it('reads the page window of the query through the cache', async () => {
      repository.list.mockResolvedValue([[], 0]);

      await productListCase.execute({ page: 2, limit: 10 });

      const [query] = cache.read.mock.calls[0] as [{ page: number; limit: number; ttlMs: number }];

      expect(cache.read).toHaveBeenCalledTimes(1);
      expect(query.page).toBe(2);
      expect(query.limit).toBe(10);
      expect(query.ttlMs).toBe(60_000);
    });

    it('computes a miss with the repository page of the same window', async () => {
      repository.list.mockResolvedValue([[], 0]);

      await productListCase.execute({ page: 2, limit: 10 });

      expect(repository.list).toHaveBeenCalledWith({ limit: 10, offset: 10 });
    });

    it('builds the page of a miss from the repository rows and their total', async () => {
      repository.list.mockResolvedValue([[{ id: '12', sku: 'SKU-0001', name: 'Lamp' }], 21]);

      const page = await productListCase.execute({ page: 2, limit: 10 });

      expect(page).toEqual({
        page: 2,
        limit: 10,
        count: 1,
        pageCount: 3,
        total: 21,
        data: [{ id: '12', sku: 'SKU-0001', name: 'Lamp' }],
      });
    });

    it('asks for the first page of 20 when the query has no window', async () => {
      repository.list.mockResolvedValue([[], 0]);

      await productListCase.execute({ page: undefined, limit: undefined });

      expect(repository.list).toHaveBeenCalledWith({ limit: 20, offset: 0 });
    });

    it('caps the limit at 100', async () => {
      repository.list.mockResolvedValue([[], 0]);

      await productListCase.execute({ page: 1, limit: 500 });

      expect(repository.list).toHaveBeenCalledWith({ limit: 100, offset: 0 });
    });

    it('answers a cached page without asking the repository', async () => {
      cache.read.mockResolvedValue({
        page: 1,
        limit: 20,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [{ id: '12', sku: 'SKU-0001', name: 'Lamp' }],
      });

      const page = await productListCase.execute({ page: undefined, limit: undefined });

      expect(page).toEqual({
        page: 1,
        limit: 20,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [{ id: '12', sku: 'SKU-0001', name: 'Lamp' }],
      });
      expect(repository.list).not.toHaveBeenCalled();
    });
  });
});
