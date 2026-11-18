import { Entity } from '@acme-libs/domain';

import type { IOrderProductSnapshot, IOrderSnapshot } from '../interfaces';

export abstract class OrderAggregate extends Entity {
  protected constructor(
    id: string,
    protected readonly orderProducts: readonly IOrderProductSnapshot[],
    protected readonly createdAt: Date,
  ) {
    super(id);
  }

  public toSnapshot(): IOrderSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      orderProducts: this.orderProducts,
    };
  }
}
