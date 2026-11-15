import { OrderLedgerCoreAdapter } from '../order-ledger-core.adapter';

describe('OrderLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: OrderLedgerCoreAdapter;

  beforeEach(() => {
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new OrderLedgerCoreAdapter({ handleEnqueue });
  });

  describe('recordPlaced', () => {
    it('enqueues the placed order under its operation key with the payload of the order', async () => {
      await adapter.recordPlaced({
        subjectId: '610',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
            { id: '621', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
          ],
        },
      });

      expect(handleEnqueue).toHaveBeenCalledTimes(1);
      expect(handleEnqueue).toHaveBeenCalledWith({
        operationKey: 'order-placed:610',
        subjectType: 'order',
        subjectId: '610',
        action: 'OrderPlaced',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
            { id: '621', productId: '100', product: { sku: 'SKU-0001', name: 'Lamp' } },
          ],
        },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
