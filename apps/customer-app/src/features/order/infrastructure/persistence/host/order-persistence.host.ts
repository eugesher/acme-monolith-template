import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Order, OrderProduct, Product } from '@acme-core/entities';

import { OrderPersistenceProductBuilder } from '../builders/order-persistence-product.builder';
import { OrderPersistenceBuilder } from '../builders/order-persistence.builder';

export abstract class OrderPersistenceHost {
  protected get orderRepository(): IHostedRepository<Order> {
    return this.orm.getRepository(Order);
  }

  protected get orderProductRepository(): IHostedRepository<OrderProduct> {
    return this.orm.getRepository(OrderProduct);
  }

  protected get productRepository(): IHostedRepository<Product> {
    return this.orm.getRepository(Product);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createOrderBuilder(): OrderPersistenceBuilder {
    return new OrderPersistenceBuilder(this.orderRepository.createQueryBuilder(Order.name));
  }

  protected createProductBuilder(): OrderPersistenceProductBuilder {
    return new OrderPersistenceProductBuilder(
      this.productRepository.createQueryBuilder(Product.name),
    );
  }
}
