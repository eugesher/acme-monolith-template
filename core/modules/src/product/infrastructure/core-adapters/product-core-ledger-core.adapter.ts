import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  PRODUCT_CORE_LEDGER_PORT,
  type IProductCoreLedgerPort,
  type IProductCoreLedgerRecordArchivedCommand,
} from '../../outbound';

@Injectable()
export class ProductCoreLedgerCoreAdapter implements IProductCoreLedgerPort {
  public static readonly PROVIDER: ClassProvider<IProductCoreLedgerPort> = {
    provide: PRODUCT_CORE_LEDGER_PORT,
    useClass: ProductCoreLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async recordArchived(command: IProductCoreLedgerRecordArchivedCommand): Promise<void> {
    const { subjectId, version, occurredAt, payload } = command;

    await this.ledger.handleEnqueue({
      operationKey: `product-archived:${subjectId}:${version}`,
      subjectType: LedgerSubjectTypeEnum.PRODUCT,
      subjectId,
      action: LedgerActionEnum.PRODUCT_ARCHIVED,
      payload,
      occurredAt,
    });
  }
}
