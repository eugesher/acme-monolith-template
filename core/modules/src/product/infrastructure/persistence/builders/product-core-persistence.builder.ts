import { SelectQueryBuilder } from 'typeorm';

import type { Product } from '@acme-core/entities';

export class ProductCorePersistenceBuilder extends SelectQueryBuilder<Product> {
  public forId(productId: string): this {
    this.select([
      `${this.alias}.id`,
      `${this.alias}.sku`,
      `${this.alias}.status`,
      `${this.alias}.version`,
      `${this.alias}.updatedAt`,
    ]).where(`${this.alias}.id = :productId`, { productId });

    return this;
  }

  public forLockById(productId: string): this {
    return this.forId(productId).setLock('pessimistic_write');
  }
}
