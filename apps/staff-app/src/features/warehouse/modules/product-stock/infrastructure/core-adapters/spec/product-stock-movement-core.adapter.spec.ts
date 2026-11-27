import type { IProductStockCorePort } from '@acme-core/contracts/product-stock';

import { ProductStockMovementCoreAdapter } from '../product-stock-movement-core.adapter';

describe('ProductStockMovementCoreAdapter', () => {
  let productStock: jest.Mocked<IProductStockCorePort>;
  let adapter: ProductStockMovementCoreAdapter;

  beforeEach(() => {
    productStock = { lock: jest.fn(), move: jest.fn() };
    productStock.lock.mockResolvedValue([{ productId: '12', quantity: 10 }]);
    productStock.move.mockResolvedValue({
      productStocks: [{ id: '700', createdAt: '2026-01-05T08:00:00.000Z' }],
      stock: [{ productId: '12', quantity: 15 }],
    });
    adapter = new ProductStockMovementCoreAdapter(productStock);
  });

  describe('lock', () => {
    it('locks the one product through the core module and keeps its stock to itself', async () => {
      await expect(adapter.lock({ productId: '12' })).resolves.toBeUndefined();

      expect(productStock.lock).toHaveBeenCalledWith({ productIds: ['12'] });
    });

    it('lets a failed lock reject', async () => {
      productStock.lock.mockRejectedValue(new Error('lock wait timeout'));

      await expect(adapter.lock({ productId: '12' })).rejects.toThrow('lock wait timeout');
    });
  });

  describe('add', () => {
    it('adds the units without an order line and answers the new row and the stock', async () => {
      const view = await adapter.add({ productId: '12', quantity: 5 });

      expect(productStock.move).toHaveBeenCalledWith({
        kind: 'add',
        movements: [{ productId: '12', quantity: 5, orderProductId: null }],
      });
      expect(view).toEqual({
        productStockId: '700',
        createdAt: '2026-01-05T08:00:00.000Z',
        quantity: 15,
      });
    });
  });
});
