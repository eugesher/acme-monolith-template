import { ProductStatusEnum } from '@acme-libs/kernel';
import type { ILedgerCorePort } from '@acme-core/contracts/ledger';

import { ProductLedgerCoreAdapter } from '../product-ledger-core.adapter';

describe('ProductLedgerCoreAdapter', () => {
  let ledger: jest.Mocked<ILedgerCorePort>;
  let adapter: ProductLedgerCoreAdapter;

  beforeEach(() => {
    ledger = { handleAppendEnqueue: jest.fn() };
    ledger.handleAppendEnqueue.mockResolvedValue(undefined);
    adapter = new ProductLedgerCoreAdapter(ledger);
  });

  describe('appendCreated', () => {
    it('enqueues a creation under the stored id', async () => {
      await adapter.appendCreated({
        subjectId: '12',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
      });

      expect(ledger.handleAppendEnqueue).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductCreated',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });

  describe('appendPublished', () => {
    it('enqueues a publication under its new version at the time of the update', async () => {
      await adapter.appendPublished({
        subjectId: '12',
        version: 6,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: ProductStatusEnum.DRAFT },
      });

      expect(ledger.handleAppendEnqueue).toHaveBeenCalledWith({
        operationKey: 'product-published:12:6',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductPublished',
        payload: { sku: 'SKU-0001', previousStatus: 'draft' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
