import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  CATALOG_PRODUCT_LIST_REPOSITORY_PORT,
  type ICatalogGetProductListQuery,
  type ICatalogGetProductListRecord,
  type ICatalogGetProductListRepositoryPort,
} from '../../../outbound';
import { CatalogPersistenceHost } from '../host/catalog-persistence.host';

@Injectable()
export class CatalogGetProductListRepository
  extends CatalogPersistenceHost
  implements ICatalogGetProductListRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ICatalogGetProductListRepositoryPort> = {
    provide: CATALOG_PRODUCT_LIST_REPOSITORY_PORT,
    useClass: CatalogGetProductListRepository,
  };

  public async list(query: ICatalogGetProductListQuery): Promise<ICatalogGetProductListRecord> {
    return await this.createProductBuilder().forList(query).getManyAndCount();
  }
}
