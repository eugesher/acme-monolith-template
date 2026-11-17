import { OrderPlaceModel } from '../order-place.model';

describe('OrderPlaceModel', () => {
  describe('getProductStockMovements', () => {
    it('turns every ordered product into a stock movement of its order product', () => {
      const order = OrderPlaceModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [
          { id: '601', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
          { id: '602', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });

      expect(order.getProductStockMovements()).toEqual([
        { productId: '100', orderProductId: '601' },
        { productId: '100', orderProductId: '602' },
      ]);
    });
  });

  describe('toLedgerPayload', () => {
    it('answers the ledger fields of the placed order with its owner and the references of its products', () => {
      const order = OrderPlaceModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [{ id: '601', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });

      expect(order.toLedgerPayload()).toEqual({
        subjectId: '600',
        occurredAt: '2026-01-03T00:00:00.000Z',
        payload: {
          customerId: 'customer-1',
          orderProducts: [{ id: '601', product: { id: '100' } }],
        },
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the log fields of the placed order with its owner and the references of its products', () => {
      const order = OrderPlaceModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [{ id: '601', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });

      expect(order.toLoggerPayload()).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        customerId: 'customer-1',
        orderProducts: [{ id: '601', product: { id: '100' } }],
      });
    });
  });

  describe('toSnapshot', () => {
    it('answers the placed order with its products and without its owner', () => {
      const order = OrderPlaceModel.reconstitute({
        id: '600',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        orderProducts: [{ id: '601', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });

      expect(order.toSnapshot()).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [{ id: '601', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });
    });
  });
});
