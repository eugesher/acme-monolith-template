import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductPublishedEvent } from '../../events/product-published.event';
import { ProductPublishModel } from '../product-publish.model';

describe('ProductPublishModel', () => {
  describe('publish', () => {
    it('publishes a draft, bumps the version and records the publication', () => {
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

      const events = product.pullDomainEvents();

      expect(product.toSnapshot().status).toBe('active');
      expect(product.version).toBe(2);
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductPublishedEvent);
      expect(events[0]).toMatchObject({
        aggregateId: '12',
        sku: 'SKU-0001',
        version: 2,
        previousStatus: 'draft',
      });
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
      expect(product.pullDomainEvents()).toEqual([]);
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
      expect(product.pullDomainEvents()).toHaveLength(1);
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
