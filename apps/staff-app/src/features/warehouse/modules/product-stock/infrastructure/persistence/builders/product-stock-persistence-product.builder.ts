import { SelectQueryBuilder } from 'typeorm';

import type { Product } from '@acme-core/entities';

export class ProductStockPersistenceProductBuilder extends SelectQueryBuilder<Product> {
  public forOne(productId: string): this {
    this.select([`${this.alias}.id`, `${this.alias}.sku`]).where(`${this.alias}.id = :productId`, {
      productId,
    });

    return this;
  }
}
