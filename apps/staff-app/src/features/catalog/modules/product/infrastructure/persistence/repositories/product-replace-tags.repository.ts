import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  PRODUCT_REPLACE_TAGS_REPOSITORY_PORT,
  type IProductReplaceTagsRecord,
  type IProductReplaceTagsRepositoryPort,
} from '../../../outbound';
import { ProductPersistenceHost } from '../host/product-persistence.host';

@Injectable()
export class ProductReplaceTagsRepository
  extends ProductPersistenceHost
  implements IProductReplaceTagsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductReplaceTagsRepositoryPort> = {
    provide: PRODUCT_REPLACE_TAGS_REPOSITORY_PORT,
    useClass: ProductReplaceTagsRepository,
  };

  public async lockOne(productId: string): Promise<Nullable<IProductReplaceTagsRecord>> {
    return await this.createProductBuilder().forLockOne(productId).getOne();
  }
}
