import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductPublishModel } from '../product-publish.model';

describe('ProductPublishModel', () => {
  describe('publish', () => {
    it('publishes a draft, bumps the version and answers the status it left', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.DRAFT,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      const previousStatus = product.publish();

      expect(product.toSnapshot().status).toBe('active');
      expect(product.version).toBe(2);
      expect(previousStatus).toBe('draft');
    });

    it('changes nothing on an active product', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      const previousStatus = product.publish();

      expect(product.toSnapshot().status).toBe('active');
      expect(product.version).toBe(3);
      expect(previousStatus).toBeUndefined();
    });
  });

  describe('a change of an archived product', () => {
    it('is allowed', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ARCHIVED,
        version: 5,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      product.publish();

      expect(product.toSnapshot()).toMatchObject({ status: 'active', version: 6 });
    });
  });

  describe('toLedgerPayload', () => {
    it('answers the publication under its version at the time of the update with the status it left', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 6,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      });

      expect(product.toLedgerPayload(ProductStatusEnum.ARCHIVED)).toEqual({
        subjectId: '12',
        version: 6,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: 'archived' },
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the published product', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toLoggerPayload()).toEqual({ id: '12' });
    });
  });
});
