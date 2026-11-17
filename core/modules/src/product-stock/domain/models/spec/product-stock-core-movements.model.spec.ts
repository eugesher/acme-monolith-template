import { ProductStockCoreMovementsModel } from '../product-stock-core-movements.model';

describe('ProductStockCoreMovementsModel', () => {
  let stockMovements: ProductStockCoreMovementsModel;

  beforeEach(() => {
    stockMovements = ProductStockCoreMovementsModel.create({
      sign: -1,
      movements: [
        { productId: '103', quantity: 1, orderProductId: '620' },
        { productId: '100', quantity: 2, orderProductId: '621' },
        { productId: '103', quantity: 1, orderProductId: '622' },
      ],
    });
  });

  describe('distinctProductIds', () => {
    it('answers every product once in the order of the movements', () => {
      expect(stockMovements.distinctProductIds).toEqual(['103', '100']);
    });
  });

  describe('distinctProducts', () => {
    it('answers every product once as a reference', () => {
      expect(stockMovements.distinctProducts).toEqual([{ id: '103' }, { id: '100' }]);
    });
  });

  describe('toInsertPayloads', () => {
    it('answers one row per movement with the quantity under the sign of the kind', () => {
      expect(stockMovements.toInsertPayloads()).toEqual([
        { productId: '103', quantity: -1, orderProductId: '620' },
        { productId: '100', quantity: -2, orderProductId: '621' },
        { productId: '103', quantity: -1, orderProductId: '622' },
      ]);
    });
  });

  describe('toProductStockIds', () => {
    it('answers the id of every inserted row as a string', () => {
      expect(
        ProductStockCoreMovementsModel.toProductStockIds([{ id: 700 }, { id: '701' }]),
      ).toEqual(['700', '701']);
    });
  });

  describe('toPostSubtractLoggerPayload', () => {
    it('answers the products whose stock the subtraction checks', () => {
      expect(stockMovements.toPostSubtractLoggerPayload()).toEqual({
        products: [{ id: '103' }, { id: '100' }],
      });
    });
  });
});
