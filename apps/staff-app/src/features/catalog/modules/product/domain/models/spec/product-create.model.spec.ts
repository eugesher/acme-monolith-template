import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductCreateModel } from '../product-create.model';

describe('ProductCreateModel', () => {
  describe('initCandidate', () => {
    it('initializes a product candidate at version 1 with a trimmed name', () => {
      const candidate = ProductCreateModel.initCandidate({ sku: 'SKU-0001', name: '  Lamp  ' });

      expect(candidate).toEqual({ sku: 'SKU-0001', name: 'Lamp', status: 'draft', version: 1 });
    });

    it.each([
      ['a lowercase sku', 'sku-0001'],
      ['a sku shorter than 3', 'AB'],
      ['a sku starting with a dash', '-ABC'],
      ['a sku longer than 64', `A${'B'.repeat(64)}`],
    ])('refuses %s with PRODUCT_SKU_INVALID', (_case, sku) => {
      expect(() => ProductCreateModel.initCandidate({ sku, name: 'Lamp' })).toThrow(
        expect.objectContaining({ code: 'PRODUCT_SKU_INVALID' }) as Error,
      );
    });

    it.each([
      ['a blank name', '   '],
      ['a name longer than 255', 'n'.repeat(256)],
    ])('refuses %s with PRODUCT_NAME_INVALID', (_case, name) => {
      expect(() => ProductCreateModel.initCandidate({ sku: 'SKU-0001', name })).toThrow(
        expect.objectContaining({
          code: 'PRODUCT_NAME_INVALID',
          message: 'Product.name must be a non-empty string of at most 255 characters',
        }) as Error,
      );
    });

    it('accepts a name of 255 characters', () => {
      const candidate = ProductCreateModel.initCandidate({
        sku: 'SKU-0001',
        name: 'n'.repeat(255),
      });

      expect(candidate.name).toHaveLength(255);
    });
  });

  describe('toLedgerPayload', () => {
    it('answers the creation as a ledger record at the time the product was created', () => {
      const product = ProductCreateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toLedgerPayload()).toEqual({
        subjectId: '12',
        occurredAt: '2026-01-01T00:00:00.000Z',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the sku of the created product', () => {
      const product = ProductCreateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(product.toLoggerPayload()).toEqual({ id: '12', sku: 'SKU-0001' });
    });
  });
});
