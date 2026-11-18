import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Product } from '@acme-core/entities';

import { ProductStockPersistenceProductBuilder } from '../builders/product-stock-persistence-product.builder';

export abstract class ProductStockPersistenceHost {
  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createProductBuilder(): ProductStockPersistenceProductBuilder {
    return new ProductStockPersistenceProductBuilder(
      this.productRepository.createQueryBuilder(Product.name),
    );
  }
}
