import type { ILedgerCorePort } from '@acme-core/contracts/ledger';

import { OrderLedgerCoreAdapter } from '../order-ledger-core.adapter';

describe('OrderLedgerCoreAdapter', () => {
  let ledger: jest.Mocked<ILedgerCorePort>;
  let adapter: OrderLedgerCoreAdapter;

  beforeEach(() => {
    ledger = { handleAppendEnqueue: jest.fn() };
    ledger.handleAppendEnqueue.mockResolvedValue(undefined);
    adapter = new OrderLedgerCoreAdapter(ledger);
  });

  describe('appendPlaced', () => {
    it('enqueues the placed order under its operation key with the payload of the order', async () => {
      await adapter.appendPlaced({
        subjectId: '610',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', product: { id: '100' } },
            { id: '621', product: { id: '100' } },
          ],
        },
      });

      expect(ledger.handleAppendEnqueue).toHaveBeenCalledTimes(1);
      expect(ledger.handleAppendEnqueue).toHaveBeenCalledWith({
        operationKey: 'order-placed:610',
        subjectType: 'order',
        subjectId: '610',
        action: 'OrderPlaced',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', product: { id: '100' } },
            { id: '621', product: { id: '100' } },
          ],
        },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
