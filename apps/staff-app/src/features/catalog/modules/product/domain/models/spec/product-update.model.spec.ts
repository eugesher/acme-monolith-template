import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductUpdateModel } from '../product-update.model';

describe('ProductUpdateModel', () => {
  describe('update', () => {
    let product: ProductUpdateModel;

    beforeEach(() => {
      product = ProductUpdateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it('renames and bumps the version', () => {
      product.update({ name: '  Desk lamp ' });

      expect(product.toSnapshot().name).toBe('Desk lamp');
      expect(product.version).toBe(4);
    });

    it('changes nothing without a name', () => {
      product.update({ name: undefined });

      expect(product.toSnapshot().name).toBe('Lamp');
      expect(product.version).toBe(3);
    });

    it('changes nothing when the trimmed name is the current one', () => {
      product.update({ name: ' Lamp ' });

      expect(product.version).toBe(3);
    });

    it('refuses a blank name with PRODUCT_NAME_INVALID', () => {
      expect(() => product.update({ name: ' ' })).toThrow(
        expect.objectContaining({ code: 'PRODUCT_NAME_INVALID' }) as Error,
      );
    });
  });

  describe('a change of an archived product', () => {
    it('is allowed', () => {
      const product = ProductUpdateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ARCHIVED,
        version: 5,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      product.update({ name: 'Desk' });

      expect(product.toSnapshot()).toMatchObject({ status: 'archived', version: 6 });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the version of the updated product', () => {
      const product = ProductUpdateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toLoggerPayload()).toEqual({ id: '12', version: 3 });
    });
  });
});
