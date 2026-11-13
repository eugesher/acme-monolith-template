import type {
  IProductStockCoreOnHandReconstitute,
  IProductStockCoreOnHandSnapshot,
} from '../interfaces';

export class ProductStockCoreOnHandModel {
  private constructor(public readonly stock: readonly IProductStockCoreOnHandSnapshot[]) {}

  public static reconstitute(
    record: IProductStockCoreOnHandReconstitute,
  ): ProductStockCoreOnHandModel {
    const { productIds, stockSums } = record;
    const stockOnHand = productIds.map((productId) => {
      const stockSum = stockSums.find((candidate) => candidate.productId === productId);

      return { productId, quantity: Number(stockSum?.quantity ?? 0) };
    });

    return new ProductStockCoreOnHandModel(stockOnHand);
  }

  public toSnapshot(): IProductStockCoreOnHandSnapshot[] {
    return this.stock.map((unit) => ({ productId: unit.productId, quantity: unit.quantity }));
  }
}
