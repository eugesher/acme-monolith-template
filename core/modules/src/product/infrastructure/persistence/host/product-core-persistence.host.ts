import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Product } from '@acme-core/entities';

import { ProductCorePersistenceBuilder } from '../builders/product-core-persistence.builder';

export abstract class ProductCorePersistenceHost {
  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createProductBuilder(): ProductCorePersistenceBuilder {
    return new ProductCorePersistenceBuilder(
      this.productRepository.createQueryBuilder(Product.name),
    );
  }
}
