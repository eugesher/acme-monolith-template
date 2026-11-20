import { CatalogProductListUseCase } from '../../../application';
import { CatalogController } from '../catalog.controller';

describe('CatalogController', () => {
  let repository: jest.Mocked<ConstructorParameters<typeof CatalogProductListUseCase>[0]>;
  let cache: jest.Mocked<ConstructorParameters<typeof CatalogProductListUseCase>[1]>;
  let controller: CatalogController;

  beforeEach(() => {
    repository = { list: jest.fn() };
    cache = { read: jest.fn() };
    cache.read.mockImplementation((query) => query.compute());
    controller = new CatalogController(new CatalogProductListUseCase(repository, cache, 60_000));
  });

  describe('handleProductList', () => {
    it('answers the page for the window of the query string', async () => {
      repository.list.mockResolvedValue([[{ id: '12', sku: 'SKU-0001', name: 'Lamp' }], 1]);

      const response = await controller.handleProductList({ page: 2, limit: 10 });

      expect(response).toEqual({
        page: 2,
        limit: 10,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [{ id: '12', sku: 'SKU-0001', name: 'Lamp' }],
      });
      expect(repository.list).toHaveBeenCalledWith({ limit: 10, offset: 10 });
    });
  });
});
