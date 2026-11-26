import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_STOCK_CORE_MOVE_REPOSITORY_PORT,
  type IProductStockCoreMoveInsertQuery,
  type IProductStockCoreMoveInsertRecord,
  type IProductStockCoreMoveRepositoryPort,
} from '../../../outbound';
import { ProductStockCoreBaseRepository } from './base/product-stock-core-base.repository';

@Injectable()
export class ProductStockCoreMoveRepository
  extends ProductStockCoreBaseRepository
  implements IProductStockCoreMoveRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductStockCoreMoveRepositoryPort> = {
    provide: PRODUCT_STOCK_CORE_MOVE_REPOSITORY_PORT,
    useClass: ProductStockCoreMoveRepository,
  };

  public async insertMany(
    queries: IProductStockCoreMoveInsertQuery[],
  ): Promise<IProductStockCoreMoveInsertRecord[]> {
    return await this.productStockRepository.insertReturning(queries);
  }
}
