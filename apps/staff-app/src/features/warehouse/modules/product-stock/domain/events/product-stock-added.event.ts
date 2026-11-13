import { DomainEventBase } from '@acme-libs/toolkit';

import type { IProductStockLedgerRecord } from '../interfaces';

export class ProductStockAddedEvent extends DomainEventBase<string> {
  constructor(
    productId: string,
    public readonly sku: string,
    public readonly quantity: number,
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
