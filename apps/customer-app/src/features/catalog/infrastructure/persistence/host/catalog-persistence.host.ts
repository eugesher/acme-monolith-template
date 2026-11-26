import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Product } from '@acme-core/entities';

import { CatalogPersistenceProductBuilder } from '../builders/catalog-persistence-product.builder';

export abstract class CatalogPersistenceHost {
  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createProductBuilder(): CatalogPersistenceProductBuilder {
    return new CatalogPersistenceProductBuilder(
      this.productRepository.createQueryBuilder(Product.name),
    );
  }
}
