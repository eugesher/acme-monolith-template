import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_GET_MANY_REPOSITORY_PORT,
  type IProductGetManyListQuery,
  type IProductGetManyRecord,
  type IProductGetManyRepositoryPort,
} from '../../../outbound';
import { ProductPersistenceHost } from '../host/product-persistence.host';

@Injectable()
export class ProductGetManyRepository
  extends ProductPersistenceHost
  implements IProductGetManyRepositoryPort
{
  public static readonly provider: ClassProvider<IProductGetManyRepositoryPort> = {
    provide: PRODUCT_GET_MANY_REPOSITORY_PORT,
    useClass: ProductGetManyRepository,
  };

  public async list(query: IProductGetManyListQuery): Promise<IProductGetManyRecord> {
    return await this.createProductBuilder().forList(query).getManyAndCount();
  }
}
