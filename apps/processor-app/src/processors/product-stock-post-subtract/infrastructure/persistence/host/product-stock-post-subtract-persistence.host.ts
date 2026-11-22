import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Product } from '@acme-core/entities';

import { ProductStockPostSubtractPersistenceProductBuilder } from '../builders/product-stock-post-subtract-persistence-product.builder';

export abstract class ProductStockPostSubtractPersistenceHost {
  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createProductBuilder(): ProductStockPostSubtractPersistenceProductBuilder {
    return new ProductStockPostSubtractPersistenceProductBuilder(
      this.productRepository.createQueryBuilder(Product.name),
    );
  }
}
