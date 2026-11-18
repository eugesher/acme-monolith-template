import { ProductStockLedgerCoreAdapter } from '../product-stock-ledger-core.adapter';

describe('ProductStockLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: ProductStockLedgerCoreAdapter;

  beforeEach(() => {
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new ProductStockLedgerCoreAdapter({ handleEnqueue });
  });

  describe('recordAdded', () => {
    it('enqueues a restock under the stock row at the time of the row', async () => {
      await adapter.recordAdded({
        productStockId: '700',
        subjectId: '12',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', quantity: 5 },
      });

      expect(handleEnqueue).toHaveBeenCalledWith({
        operationKey: 'product-restocked:700',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductRestocked',
        payload: { sku: 'SKU-0001', quantity: 5 },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
