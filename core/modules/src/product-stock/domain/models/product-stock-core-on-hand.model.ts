import type {
  IProductStockCoreOnHandReconstitute,
  IProductStockCoreOnHandSnapshot,
} from '../interfaces';

export class ProductStockCoreOnHandModel {
  private constructor(public readonly stock: readonly IProductStockCoreOnHandSnapshot[]) {}

  public static reconstitute(
    record: IProductStockCoreOnHandReconstitute,
  ): ProductStockCoreOnHandModel {
    const { products, stockSums } = record;
    const stockOnHand = products.map((product) => {
      const productId = product.id;
      const stockSum = stockSums.find((candidate) => candidate.productId === productId);

      return { productId, quantity: stockSum?.quantity ?? 0 };
    });

    return new ProductStockCoreOnHandModel(stockOnHand);
  }

  public static toProductIds(products: { id: string }[]): string[] {
    return products.map((product) => product.id);
  }

  public toSnapshot(): IProductStockCoreOnHandSnapshot[] {
    return this.stock.map((unit) => ({ productId: unit.productId, quantity: unit.quantity }));
  }
}
