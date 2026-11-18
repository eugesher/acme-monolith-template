import { ProductStockCorePersistenceHost } from '../../host/product-stock-core-persistence.host';
import type {
  IProductStockCoreLockProductRecord,
  IProductStockCoreLockSumRecord,
} from '../../../../outbound';

export abstract class ProductStockCoreBaseRepository extends ProductStockCorePersistenceHost {
  public async lockProducts(
    productIds: readonly string[],
  ): Promise<IProductStockCoreLockProductRecord[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductBuilder().forLockProducts(productIds).getMany();
  }

  public async sumStock(productIds: readonly string[]): Promise<IProductStockCoreLockSumRecord[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductStockBuilder()
      .forSumStock(productIds)
      .getRawMany<IProductStockCoreLockSumRecord>();
  }
}
