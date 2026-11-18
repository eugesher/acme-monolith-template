import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductCoreLedgerCoreAdapter } from '../product-core-ledger-core.adapter';

describe('ProductCoreLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: ProductCoreLedgerCoreAdapter;

  beforeEach(() => {
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new ProductCoreLedgerCoreAdapter({ handleEnqueue });
  });

  describe('recordArchived', () => {
    it('enqueues the archive under the product and the version it produced', async () => {
      await adapter.recordArchived({
        subjectId: '12',
        version: 4,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: ProductStatusEnum.ACTIVE },
      });

      expect(handleEnqueue).toHaveBeenCalledTimes(1);
      expect(handleEnqueue).toHaveBeenCalledWith({
        operationKey: 'product-archived:12:4',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductArchived',
        payload: { sku: 'SKU-0001', previousStatus: 'active' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
