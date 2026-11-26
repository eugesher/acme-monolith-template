import type { IProductStockCorePort } from '@acme-core/contracts/product-stock';

import { OrderProductStockCoreAdapter } from '../order-product-stock-core.adapter';

describe('OrderProductStockCoreAdapter', () => {
  let productStock: jest.Mocked<IProductStockCorePort>;
  let adapter: OrderProductStockCoreAdapter;

  beforeEach(() => {
    productStock = { handleLock: jest.fn(), handleMove: jest.fn() };
    productStock.handleLock.mockResolvedValue([{ productId: '100', quantity: 8 }]);
    productStock.handleMove.mockResolvedValue({
      productStocks: [
        { id: '700', createdAt: '2026-01-05T08:00:00.000Z' },
        { id: '701', createdAt: '2026-01-05T08:00:00.000Z' },
      ],
      stock: [{ productId: '100', quantity: 6 }],
    });
    adapter = new OrderProductStockCoreAdapter(productStock);
  });

  describe('lock', () => {
    it('locks the products through the core module and answers their stock', async () => {
      const stock = await adapter.lock({ productIds: ['100'] });

      expect(productStock.handleLock).toHaveBeenCalledWith({ productIds: ['100'] });
      expect(stock).toEqual([{ productId: '100', quantity: 8 }]);
    });
  });

  describe('withdraw', () => {
    it('subtracts one unit per order line through the core module and answers nothing', async () => {
      await expect(
        adapter.withdraw({
          movements: [
            { productId: '100', orderProductId: '620' },
            { productId: '100', orderProductId: '621' },
          ],
        }),
      ).resolves.toBeUndefined();

      expect(productStock.handleMove).toHaveBeenCalledWith({
        kind: 'subtract',
        movements: [
          { productId: '100', quantity: 1, orderProductId: '620' },
          { productId: '100', quantity: 1, orderProductId: '621' },
        ],
      });
    });
  });
});
