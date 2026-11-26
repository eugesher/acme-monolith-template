import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Product } from '@acme-core/entities';

import { ProductPersistenceBuilder } from '../builders/product-persistence.builder';

export abstract class ProductPersistenceHost {
  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createProductBuilder(): ProductPersistenceBuilder {
    return new ProductPersistenceBuilder(this.productRepository.createQueryBuilder(Product.name));
  }
}
