import { ProductStatusEnum } from '@acme-libs/kernel';

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
      await adapter.recordCreated({
        subjectId: '12',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
      });

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

  describe('recordPublished', () => {
    it('enqueues a publication under its new version, stamped now', async () => {
      await adapter.recordPublished({
        subjectId: '12',
        version: 6,
        payload: { sku: 'SKU-0001', previousStatus: ProductStatusEnum.DRAFT },
      });

      expect(handleEnqueue).toHaveBeenCalledWith({
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
