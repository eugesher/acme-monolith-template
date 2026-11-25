import { ProductStockCorePersistenceHost } from '../../host/product-stock-core-persistence.host';
import type {
  IProductStockCoreLockProductRecord,
  IProductStockCoreLockSumRecord,
  IProductStockCoreMoveProductRecord,
  IProductStockCoreMoveSumRecord,
} from '../../../../outbound';

export abstract class ProductStockCoreBaseRepository extends ProductStockCorePersistenceHost {
  public async lockMany(
    productIds: readonly string[],
  ): Promise<(IProductStockCoreLockProductRecord & IProductStockCoreMoveProductRecord)[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductBuilder().forLockMany(productIds).getMany();
  }

  public async sumStock(
    productIds: readonly string[],
  ): Promise<(IProductStockCoreLockSumRecord & IProductStockCoreMoveSumRecord)[]> {
    if (productIds.length === 0) {
      return [];
    }

    const sumRows = await this.createProductStockBuilder()
      .forSumStock(productIds)
      .getRawMany<{ productId: string; quantity: string }>();

    return sumRows.map((row) => ({ productId: row.productId, quantity: Number(row.quantity) }));
  }
}
