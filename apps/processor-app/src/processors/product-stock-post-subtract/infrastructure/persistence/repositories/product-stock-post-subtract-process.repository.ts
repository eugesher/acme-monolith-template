import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_STOCK_POST_SUBTRACT_PROCESS_REPOSITORY_PORT,
  type IProductStockPostSubtractProcessProductRecord,
  type IProductStockPostSubtractProcessRepositoryPort,
} from '../../../outbound';
import { ProductStockPostSubtractPersistenceHost } from '../host/product-stock-post-subtract-persistence.host';

@Injectable()
export class ProductStockPostSubtractProcessRepository
  extends ProductStockPostSubtractPersistenceHost
  implements IProductStockPostSubtractProcessRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductStockPostSubtractProcessRepositoryPort> = {
    provide: PRODUCT_STOCK_POST_SUBTRACT_PROCESS_REPOSITORY_PORT,
    useClass: ProductStockPostSubtractProcessRepository,
  };

  public async findActiveMany(
    productIds: string[],
  ): Promise<IProductStockPostSubtractProcessProductRecord[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductBuilder().forActiveMany(productIds).getMany();
  }
}
