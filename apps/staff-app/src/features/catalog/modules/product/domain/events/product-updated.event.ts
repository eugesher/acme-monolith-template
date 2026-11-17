import { DomainEventBase } from '@acme-libs/toolkit';

import type { IProductUpdate } from '../interfaces';

export class ProductUpdatedEvent extends DomainEventBase {
  constructor(
    productId: string,
    public readonly changes: IProductUpdate,
    public readonly previous: IProductUpdate,
  ) {
    super(productId);
  }
}
