import { OrderCandidateModel } from '../order-candidate.model';

describe('OrderCandidateModel', () => {
  describe('distinctProductIds', () => {
    it('answers every requested product once in the request order', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['103', '100', '103'],
      });

      expect(candidate.distinctProductIds).toEqual(['103', '100']);
    });
  });

  describe('getOrderProductCandidates', () => {
    it('answers one order product per requested unit in the request order', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100', '103', '100'],
      });

      expect(candidate.getOrderProductCandidates('610')).toEqual([
        { orderId: '610', productId: '100' },
        { orderId: '610', productId: '103' },
        { orderId: '610', productId: '100' },
      ]);
    });
  });

  describe('validate', () => {
    it('refuses an empty order with ORDER_EMPTY', () => {
      const candidate = OrderCandidateModel.create({ customerId: 'customer-1', productIds: [] });

      expect(() => candidate.validate()).toThrow(
        expect.objectContaining({
          code: 'ORDER_EMPTY',
          message: 'An order must contain at least one product',
        }) as Error,
      );
    });

    it('accepts an order with a product', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100'],
      });

      expect(() => candidate.validate()).not.toThrow();
    });
  });

  describe('assertProducts', () => {
    it('refuses a product that is not active with ORDER_PRODUCT_NOT_FOUND', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100', '999'],
      });

      expect(() => candidate.assertProducts([{ id: '100' }])).toThrow(
        expect.objectContaining({
          code: 'ORDER_PRODUCT_NOT_FOUND',
          message: 'Product 999 was not found',
          details: { productId: '999' },
        }) as Error,
      );
    });

    it('accepts products that are all active', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100', '103', '100'],
      });

      expect(() => candidate.assertProducts([{ id: '100' }, { id: '103' }])).not.toThrow();
    });
  });

  describe('assertStockQuantities', () => {
    it('refuses more units than in stock with ORDER_STOCK_INSUFFICIENT', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100', '100', '100'],
      });

      expect(() => candidate.assertStockQuantities([{ productId: '100', quantity: 2 }])).toThrow(
        expect.objectContaining({
          code: 'ORDER_STOCK_INSUFFICIENT',
          message: 'Product 100 has 2 in stock, 3 requested',
          details: { productId: '100', requested: 3, available: 2 },
        }) as Error,
      );
    });

    it('counts a product without stock data as zero in stock', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100'],
      });

      expect(() => candidate.assertStockQuantities([])).toThrow(
        expect.objectContaining({
          code: 'ORDER_STOCK_INSUFFICIENT',
          details: { productId: '100', requested: 1, available: 0 },
        }) as Error,
      );
    });

    it('accepts exactly the units in stock', () => {
      const candidate = OrderCandidateModel.create({
        customerId: 'customer-1',
        productIds: ['100', '103', '100'],
      });

      expect(() =>
        candidate.assertStockQuantities([
          { productId: '100', quantity: 2 },
          { productId: '103', quantity: 1 },
        ]),
      ).not.toThrow();
    });
  });
});
