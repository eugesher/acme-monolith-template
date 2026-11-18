import { DomainEvent } from '@acme-libs/domain';
import type { ProductStatusEnum } from '@acme-libs/kernel';

import type { IProductLedgerRecord } from '../interfaces';

export class ProductPublishedEvent extends DomainEvent {
  constructor(
    productId: string,
    private readonly sku: string,
    private readonly version: number,
    private readonly previousStatus: ProductStatusEnum,
  ) {
    super(productId);
  }

  public toLedgerRecord(): IProductLedgerRecord {
    const { aggregateId, sku, version, previousStatus } = this;
    const occurredAt = this.occurredAt.toISOString();

    return {
      operationKey: `product-published:${aggregateId}:${version}`,
      subjectType: 'product',
      subjectId: aggregateId,
      action: 'ProductPublished',
      payload: { sku, previousStatus },
      occurredAt,
    };
  }
}
