import { ProductLedgerCoreAdapter } from '../product-ledger-core.adapter';

describe('ProductLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: ProductLedgerCoreAdapter;

  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-01-05T08:00:00.000Z') });
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new ProductLedgerCoreAdapter({ handleEnqueue });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('recordCreated', () => {
    it('enqueues a creation under the stored id', async () => {
      await adapter.recordCreated({ productId: '12', sku: 'SKU-0001', name: 'Lamp' });

      expect(handleEnqueue).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductCreated',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });

  describe('recordEvents', () => {
    it('enqueues every ledger record in order', async () => {
      await adapter.recordEvents({
        ledgerRecords: [
          {
            operationKey: 'product-published:12:6',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'draft' },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
          {
            operationKey: 'product-published:12:7',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'archived' },
            occurredAt: '2026-01-05T08:00:01.000Z',
          },
        ],
      });

      expect(handleEnqueue.mock.calls).toEqual([
        [
          {
            operationKey: 'product-published:12:6',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'draft' },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
        ],
        [
          {
            operationKey: 'product-published:12:7',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'archived' },
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
            operationKey: 'product-published:12:6',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'draft' },
            occurredAt: '2026-01-05T08:00:00.000Z',
          },
          {
            operationKey: 'product-published:12:7',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductPublished',
            payload: { sku: 'SKU-0001', previousStatus: 'archived' },
            occurredAt: '2026-01-05T08:00:01.000Z',
          },
        ],
      });

      await expect(record).rejects.toThrow('redis is down');
      expect(handleEnqueue).toHaveBeenCalledTimes(1);
    });
  });
});
