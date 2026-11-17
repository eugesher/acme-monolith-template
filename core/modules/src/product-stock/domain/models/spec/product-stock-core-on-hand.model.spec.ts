import { ProductStockCoreOnHandModel } from '../product-stock-core-on-hand.model';

describe('ProductStockCoreOnHandModel', () => {
  describe('toSnapshot', () => {
    it('answers the on-hand of every product in the order of the products, as a number', () => {
      const onHand = ProductStockCoreOnHandModel.reconstitute({
        products: [{ id: '103' }, { id: '100' }],
        stockSums: [
          { productId: '100', quantity: '8' },
          { productId: '103', quantity: 2 },
        ],
      });

      expect(onHand.toSnapshot()).toEqual([
        { productId: '103', quantity: 2 },
        { productId: '100', quantity: 8 },
      ]);
    });

    it('answers zero for a product without stock rows', () => {
      const onHand = ProductStockCoreOnHandModel.reconstitute({
        products: [{ id: '100' }, { id: '103' }],
        stockSums: [{ productId: '100', quantity: '8' }],
      });

      expect(onHand.toSnapshot()).toEqual([
        { productId: '100', quantity: 8 },
        { productId: '103', quantity: 0 },
      ]);
    });
  });

  describe('toProductIds', () => {
    it('answers the id of every product', () => {
      expect(ProductStockCoreOnHandModel.toProductIds([{ id: '103' }, { id: '100' }])).toEqual([
        '103',
        '100',
      ]);
    });
  });
});
