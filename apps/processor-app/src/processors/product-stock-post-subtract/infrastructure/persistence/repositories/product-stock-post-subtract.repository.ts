import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT,
  type IProductStockPostSubtractProductRecord,
  type IProductStockPostSubtractRepositoryPort,
} from '../../../outbound';
import { ProductStockPostSubtractPersistenceHost } from '../host/product-stock-post-subtract-persistence.host';

@Injectable()
export class ProductStockPostSubtractRepository
  extends ProductStockPostSubtractPersistenceHost
  implements IProductStockPostSubtractRepositoryPort
{
  public static readonly provider: ClassProvider<IProductStockPostSubtractRepositoryPort> = {
    provide: PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT,
    useClass: ProductStockPostSubtractRepository,
  };

  public async findActive(productIds: string[]): Promise<IProductStockPostSubtractProductRecord[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductBuilder().forActive(productIds).getMany();
  }
}
