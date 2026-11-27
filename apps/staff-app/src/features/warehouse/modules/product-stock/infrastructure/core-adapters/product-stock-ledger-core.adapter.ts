import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  PRODUCT_STOCK_LEDGER_PORT,
  type IProductStockLedgerAppendAddedCommand,
  type IProductStockLedgerPort,
} from '../../outbound';

@Injectable()
export class ProductStockLedgerCoreAdapter implements IProductStockLedgerPort {
  public static readonly PROVIDER: ClassProvider<IProductStockLedgerPort> = {
    provide: PRODUCT_STOCK_LEDGER_PORT,
    useClass: ProductStockLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async appendAdded(command: IProductStockLedgerAppendAddedCommand): Promise<void> {
    const { productStockId, subjectId, occurredAt, payload } = command;

    await this.ledger.appendEnqueue({
      operationKey: `product-restocked:${productStockId}`,
      subjectType: LedgerSubjectTypeEnum.PRODUCT,
      subjectId,
      action: LedgerActionEnum.PRODUCT_RESTOCKED,
      payload,
      occurredAt,
    });
  }
}
