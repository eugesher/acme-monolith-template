import { ProductStockAddModel } from '../product-stock-add.model';

describe('ProductStockAddModel', () => {
  describe('reconstitute', () => {
    it('restores the stock of a stored product', () => {
      const stock = ProductStockAddModel.reconstitute({ id: '12', sku: 'SKU-0001' });

      expect(stock.id).toBe('12');
    });
  });

  describe('add', () => {
    it('holds the units added to the product for the ledger', () => {
      const stock = ProductStockAddModel.reconstitute({ id: '12', sku: 'SKU-0001' });

      stock.add(5);

      expect(
        stock.toLedgerPayload({ productStockId: '700', createdAt: '2026-01-05T08:00:00.000Z' }),
      ).toEqual({
        productStockId: '700',
        subjectId: '12',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', quantity: 5 },
      });
    });

    it.each([
      ['zero', 0],
      ['a negative quantity', -1],
      ['a fraction', 2.5],
      ['more than 100000', 100_001],
    ])('refuses %s with PRODUCT_STOCK_QUANTITY_INVALID', (_case, quantity) => {
      const stock = ProductStockAddModel.reconstitute({ id: '12', sku: 'SKU-0001' });

      expect(() => stock.add(quantity)).toThrow(
        expect.objectContaining({
          code: 'PRODUCT_STOCK_QUANTITY_INVALID',
          message: `Product restock quantity must be an integer from 1 to 100000, got ${quantity}`,
        }) as Error,
      );
    });
  });

  describe('payloads', () => {
    it('answers the stock on hand of the product', () => {
      const productStock = ProductStockAddModel.reconstitute({ id: '12', sku: 'SKU-0001' });

      expect(productStock.toOnHandSnapshot(15)).toEqual({ productId: '12', quantity: 15 });
    });

    it('answers the log fields of a restock', () => {
      expect(
        ProductStockAddModel.toLoggerPayload({
          productStockId: '700',
          productId: '12',
          quantity: 5,
        }),
      ).toEqual({ id: '700', productId: '12', quantity: 5 });
    });
  });
});
