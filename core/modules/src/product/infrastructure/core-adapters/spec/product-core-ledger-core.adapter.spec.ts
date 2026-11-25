import { ProductStatusEnum } from '@acme-libs/kernel';
import type { ILedgerCorePort } from '@acme-core/contracts/ledger';

import { ProductCoreLedgerCoreAdapter } from '../product-core-ledger-core.adapter';

describe('ProductCoreLedgerCoreAdapter', () => {
  let ledger: jest.Mocked<ILedgerCorePort>;
  let adapter: ProductCoreLedgerCoreAdapter;

  beforeEach(() => {
    ledger = { handleAppendEnqueue: jest.fn() };
    ledger.handleAppendEnqueue.mockResolvedValue();
    adapter = new ProductCoreLedgerCoreAdapter(ledger);
  });

  describe('appendArchived', () => {
    it('enqueues the archive under the product and the version it produced', async () => {
      await adapter.appendArchived({
        subjectId: '12',
        version: 4,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: ProductStatusEnum.ACTIVE },
      });

      expect(ledger.handleAppendEnqueue).toHaveBeenCalledTimes(1);
      expect(ledger.handleAppendEnqueue).toHaveBeenCalledWith({
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
