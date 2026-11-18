import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductCoreArchiveModel } from '../product-core-archive.model';

describe('ProductCoreArchiveModel', () => {
  describe('archive', () => {
    it.each([ProductStatusEnum.DRAFT, ProductStatusEnum.ACTIVE])(
      'archives a %s product and bumps the version',
      (status) => {
        const product = ProductCoreArchiveModel.reconstitute({
          id: '12',
          sku: 'SKU-0001',
          status,
          version: 3,
          updatedAt: new Date('2026-01-05T08:00:00.000Z'),
        });

        product.archive();

        expect(product.status).toBe('archived');
        expect(product.version).toBe(4);
        expect(product.isArchived).toBe(true);
      },
    );

    it('changes nothing on an archived product', () => {
      const product = ProductCoreArchiveModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 5,
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      });

      product.archive();

      expect(product.status).toBe('archived');
      expect(product.version).toBe(5);
    });
  });

  describe('payloads', () => {
    let product: ProductCoreArchiveModel;

    beforeEach(() => {
      product = ProductCoreArchiveModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 4,
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      });
    });

    it('answers the row to update under the version as read', () => {
      expect(product.toUpdatePayload(3)).toEqual({
        id: '12',
        versionAsRead: 3,
        status: 'archived',
        version: 4,
      });
    });

    it('answers the archive as a ledger record at the time of the update with the status it left', () => {
      expect(product.toLedgerPayload(ProductStatusEnum.ACTIVE)).toEqual({
        subjectId: '12',
        version: 4,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: 'active' },
      });
    });
  });
});
