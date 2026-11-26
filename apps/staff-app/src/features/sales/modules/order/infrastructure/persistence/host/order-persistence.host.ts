import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Order } from '@acme-core/entities';

import { OrderPersistenceBuilder } from '../builders/order-persistence.builder';

export abstract class OrderPersistenceHost {
  protected get orderRepository(): IHostedRepository<Order> {
    return this.orm.getRepository(Order);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createOrderBuilder(): OrderPersistenceBuilder {
    return new OrderPersistenceBuilder(this.orderRepository.createQueryBuilder(Order.name));
  }
}
