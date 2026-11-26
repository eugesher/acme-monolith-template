import { SelectQueryBuilder } from 'typeorm';

import { ProductStatusEnum } from '@acme-libs/kernel';
import type { Product } from '@acme-core/entities';

export class ProductStockPostSubtractPersistenceProductBuilder extends SelectQueryBuilder<Product> {
  public forActiveMany(productIds: string[]): this {
    this.select([`${this.alias}.id`])
      .where(`${this.alias}.id IN (:...productIds)`, { productIds })
      .andWhere(`${this.alias}.status = :status`, { status: ProductStatusEnum.ACTIVE })
      .orderBy(`${this.alias}.id`, 'ASC');

    return this;
  }
}
