import { OrderModel } from '../order.model';

describe('OrderModel', () => {
  describe('reconstitute', () => {
    it('restores a stored order with its products', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '600', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.id).toBe('600');
      expect(order.customerId).toBe('customer-1');
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
        customerId: 'customer-1',
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

  describe('toLedgerPayload', () => {
    it('answers the ledger fields of the placed order with its owner and its products', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.toLedgerPayload()).toEqual({
        subjectId: '600',
        occurredAt: '2026-01-03T00:00:00.000Z',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
          ],
        },
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the log fields of the placed order with its owner and its products', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.toLoggerPayload()).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        customerId: 'customer-1',
        orderProducts: [
          { id: '601', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });
    });
  });

  describe('toSnapshot', () => {
    it('maps a stored order with its products and without its owner', () => {
      const order = OrderModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
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
