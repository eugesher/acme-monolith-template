import type { Nullable } from '@acme-libs/toolkit';

import { ProductPersistenceHost } from '../../host/product-persistence.host';
import type { IProductAccessRecord, IProductWriteRecord } from '../../../../outbound';

export abstract class ProductBaseRepository extends ProductPersistenceHost {
  public async findOne(
    productId: string,
  ): Promise<Nullable<IProductAccessRecord & IProductWriteRecord>> {
    return await this.createProductBuilder().forOne(productId).getOne();
  }
}
