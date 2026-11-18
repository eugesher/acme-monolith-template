import { DomainEvent } from '@acme-libs/domain';

import type { IProductStockLedgerRecord } from '../interfaces';

export class ProductStockAddedEvent extends DomainEvent {
  constructor(
    productId: string,
    private readonly sku: string,
    private readonly quantity: number,
  ) {
    super(productId);
  }

  public toLedgerRecord(productStockId: string): IProductStockLedgerRecord {
    const { aggregateId, sku, quantity } = this;
    const occurredAt = this.occurredAt.toISOString();

    return {
      operationKey: `product-restocked:${productStockId}`,
      subjectType: 'product',
      subjectId: aggregateId,
      action: 'ProductRestocked',
      payload: { sku, quantity },
      occurredAt,
    };
  }
}
