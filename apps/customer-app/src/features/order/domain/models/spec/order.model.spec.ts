import { OrderModel } from '../order.model';

describe('OrderModel', () => {
  describe('reconstitute', () => {
    it('restores a stored order with its products', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '600', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.id).toBe('600');
      expect(order.createdAt).toEqual(new Date('2026-01-03T00:00:00.000Z'));
      expect(order.orderProducts).toEqual([
        { id: '600', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
      ]);
    });
  });

  describe('getProductStockMovements', () => {
    it('turns every ordered product into a stock movement of its order product', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
          { id: '602', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.getProductStockMovements()).toEqual([
        { productId: '100', orderProductId: '601' },
        { productId: '100', orderProductId: '602' },
      ]);
    });
  });

  describe('toSnapshot', () => {
    it('maps a stored order with its products', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.toSnapshot()).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });
    });
  });
});
