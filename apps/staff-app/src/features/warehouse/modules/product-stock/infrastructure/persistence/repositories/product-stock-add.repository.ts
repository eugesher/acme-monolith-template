import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  PRODUCT_STOCK_ADD_REPOSITORY_PORT,
  type IProductStockAddProductRecord,
  type IProductStockAddRepositoryPort,
} from '../../../outbound';
import { ProductStockPersistenceHost } from '../host/product-stock-persistence.host';

@Injectable()
export class ProductStockAddRepository
  extends ProductStockPersistenceHost
  implements IProductStockAddRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductStockAddRepositoryPort> = {
    provide: PRODUCT_STOCK_ADD_REPOSITORY_PORT,
    useClass: ProductStockAddRepository,
  };

  public async findOne(productId: string): Promise<Nullable<IProductStockAddProductRecord>> {
    return await this.createProductBuilder().forOne(productId).getOne();
  }
}
