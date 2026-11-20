import type { IProductStockCorePort } from '@acme-core/contracts/product-stock';

import { ProductStockOnHandCoreAdapter } from '../product-stock-on-hand-core.adapter';

describe('ProductStockOnHandCoreAdapter', () => {
  let productStock: jest.Mocked<IProductStockCorePort>;
  let adapter: ProductStockOnHandCoreAdapter;

  beforeEach(() => {
    productStock = { handleLock: jest.fn(), handleMove: jest.fn() };
    adapter = new ProductStockOnHandCoreAdapter(productStock);
  });

  describe('lock', () => {
    it('locks the products through the core module and answers their stock', async () => {
      productStock.handleLock.mockResolvedValue([{ productId: '106', quantity: 0 }]);

      const stock = await adapter.lock({ productIds: ['106'] });

      expect(productStock.handleLock).toHaveBeenCalledWith({ productIds: ['106'] });
      expect(stock).toEqual([{ productId: '106', quantity: 0 }]);
    });
  });
});
