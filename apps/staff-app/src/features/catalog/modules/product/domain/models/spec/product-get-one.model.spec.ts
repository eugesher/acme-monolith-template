import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductGetOneModel } from '../product-get-one.model';

describe('ProductGetOneModel', () => {
  describe('reconstitute', () => {
    it('restores a stored product without recording anything', () => {
      const product = ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toSnapshot()).toMatchObject({
        id: '12',
        status: 'active',
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });

    it.each([
      ['zero', 0],
      ['a fraction', 1.5],
    ])('refuses a version of %s with PRODUCT_VERSION_INVALID', (_case, version) => {
      expect(() =>
        ProductGetOneModel.reconstitute({
          id: '12',
          sku: 'SKU-0001',
          name: 'Lamp',
          status: ProductStatusEnum.ACTIVE,
          version,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'PRODUCT_VERSION_INVALID',
          message: `Product.version must be a positive integer, got ${version}`,
        }) as Error,
      );
    });

    it('refuses a stored sku that breaks the pattern', () => {
      expect(() =>
        ProductGetOneModel.reconstitute({
          id: '12',
          sku: 'bad',
          name: 'Lamp',
          status: ProductStatusEnum.ACTIVE,
          version: 1,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'PRODUCT_SKU_INVALID',
          message: 'Product.sku must match /^[A-Z0-9][A-Z0-9-]{2,63}$/, got bad',
        }) as Error,
      );
    });
  });

  describe('toSnapshot', () => {
    it('answers a stored product with ISO instants', () => {
      const product = ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      const view = product.toSnapshot();

      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'active',
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });

  describe('toUpdatePayload', () => {
    it('answers the row to update under the version as read', () => {
      const product = ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toUpdatePayload(2)).toEqual({
        id: '12',
        versionAsRead: 2,
        name: 'Lamp',
        status: 'active',
        version: 3,
      });
    });
  });

  describe('assertExpectedVersion', () => {
    let product: ProductGetOneModel;

    beforeEach(() => {
      product = ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it.each([
      ['no If-Match', undefined],
      ['the current version', 3],
    ])('accepts %s', (_case, expectedVersion) => {
      expect(() => product.assertExpectedVersion(expectedVersion)).not.toThrow();
    });

    it('refuses another version with VERSION_MISMATCH and the current version', () => {
      expect(() => product.assertExpectedVersion(2)).toThrow(
        expect.objectContaining({
          code: 'VERSION_MISMATCH',
          message: 'Product 12: If-Match version 2 does not match the current version 3',
          details: { currentVersion: 3 },
        }) as Error,
      );
    });
  });
});
