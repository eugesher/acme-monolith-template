import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductPublishModel } from '../product-publish.model';

describe('ProductPublishModel', () => {
  describe('publish', () => {
    it('publishes a draft and bumps the version', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.DRAFT,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      product.publish();

      expect(product.toSnapshot().status).toBe('active');
      expect(product.version).toBe(2);
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

      product.publish();

      expect(product.toSnapshot().status).toBe('active');
      expect(product.version).toBe(3);
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
    it('answers the publication under the new version with the status it left', () => {
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

      expect(product.toLedgerPayload()).toEqual({
        subjectId: '12',
        version: 6,
        payload: { sku: 'SKU-0001', previousStatus: 'archived' },
      });
    });

    it('answers nothing when the product was already active', () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      product.publish();

      expect(product.toLedgerPayload()).toBeUndefined();
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
