import { DomainEvent } from '@acme-libs/domain';

import type { IProductUpdate } from '../interfaces';

export class ProductUpdatedEvent extends DomainEvent {
  constructor(
    productId: string,
    private readonly changes: IProductUpdate,
    private readonly previous: IProductUpdate,
  ) {
    super(productId);
  }
}
