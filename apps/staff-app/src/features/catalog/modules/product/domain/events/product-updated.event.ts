import { DomainEventBase } from '@acme-libs/toolkit';

import type { IProductUpdate } from '../interfaces';

export class ProductUpdatedEvent extends DomainEventBase {
  constructor(
    productId: string,
    private readonly changes: IProductUpdate,
    private readonly previous: IProductUpdate,
  ) {
    super(productId);
  }
}
