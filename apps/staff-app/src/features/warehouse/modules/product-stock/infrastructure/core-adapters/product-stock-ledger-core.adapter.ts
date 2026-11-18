import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  PRODUCT_STOCK_LEDGER_PORT,
  type IProductStockLedgerPort,
  type IProductStockLedgerRecordAddedCommand,
} from '../../outbound';

@Injectable()
export class ProductStockLedgerCoreAdapter implements IProductStockLedgerPort {
  public static readonly provider: ClassProvider<IProductStockLedgerPort> = {
    provide: PRODUCT_STOCK_LEDGER_PORT,
    useClass: ProductStockLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async recordAdded(command: IProductStockLedgerRecordAddedCommand): Promise<void> {
    const { productStockId, subjectId, payload } = command;
    const occurredAt = new Date().toISOString();

    await this.ledger.handleEnqueue({
      operationKey: `product-restocked:${productStockId}`,
      subjectType: 'product',
      subjectId,
      action: 'ProductRestocked',
      payload,
      occurredAt,
    });
  }
}
