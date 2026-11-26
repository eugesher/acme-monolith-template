import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  CATALOG_PRODUCT_LIST_REPOSITORY_PORT,
  type ICatalogProductListQuery,
  type ICatalogProductListRecord,
  type ICatalogProductListRepositoryPort,
} from '../../../outbound';
import { CatalogPersistenceHost } from '../host/catalog-persistence.host';

@Injectable()
export class CatalogProductListRepository
  extends CatalogPersistenceHost
  implements ICatalogProductListRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ICatalogProductListRepositoryPort> = {
    provide: CATALOG_PRODUCT_LIST_REPOSITORY_PORT,
    useClass: CatalogProductListRepository,
  };

  public async list(query: ICatalogProductListQuery): Promise<ICatalogProductListRecord> {
    return await this.createProductBuilder().forList(query).getManyAndCount();
  }
}
