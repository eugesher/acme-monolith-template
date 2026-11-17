import { ProductStockLedgerCoreAdapter } from '../product-stock-ledger-core.adapter';

describe('ProductStockLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: ProductStockLedgerCoreAdapter;

  beforeEach(() => {
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new ProductStockLedgerCoreAdapter({ handleEnqueue });
  });

  describe('recordEvents', () => {
    it('enqueues every ledger record in order', async () => {
      await adapter.recordEvents({
        ledgerRecords: [
          {
            operationKey: 'product-restocked:700',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 5 },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
          {
            operationKey: 'product-restocked:701',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 3 },
            occurredAt: '2026-01-05T08:00:01.000Z',
          },
        ],
      });

      expect(handleEnqueue.mock.calls).toEqual([
        [
          {
            operationKey: 'product-restocked:700',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 5 },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
        ],
        [
          {
            operationKey: 'product-restocked:701',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 3 },
            occurredAt: '2026-01-05T08:00:01.000Z',
          },
        ],
      ]);
    });

    it('stops at a failed enqueue and rejects', async () => {
      handleEnqueue.mockRejectedValueOnce(new Error('redis is down'));

      const record = adapter.recordEvents({
        ledgerRecords: [
          {
            operationKey: 'product-restocked:700',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 5 },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
          {
            operationKey: 'product-restocked:701',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductRestocked',
            payload: { sku: 'SKU-0001', quantity: 3 },
            occurredAt: '2026-01-05T08:00:01.000Z',
          },
        ],
      });

      await expect(record).rejects.toThrow('redis is down');
      expect(handleEnqueue).toHaveBeenCalledTimes(1);
    });
  });
});
