import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  PRODUCT_LEDGER_PORT,
  type IProductLedgerPort,
  type IProductLedgerRecordCreatedCommand,
  type IProductLedgerRecordPublishedCommand,
} from '../../outbound';

@Injectable()
export class ProductLedgerCoreAdapter implements IProductLedgerPort {
  public static readonly PROVIDER: ClassProvider<IProductLedgerPort> = {
    provide: PRODUCT_LEDGER_PORT,
    useClass: ProductLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async recordCreated(command: IProductLedgerRecordCreatedCommand): Promise<void> {
    const { subjectId, occurredAt, payload } = command;

    await this.ledger.handleEnqueue({
      operationKey: `product-created:${subjectId}`,
      subjectType: LedgerSubjectTypeEnum.PRODUCT,
      subjectId,
      action: LedgerActionEnum.PRODUCT_CREATED,
      payload,
      occurredAt,
    });
  }

  public async recordPublished(command: IProductLedgerRecordPublishedCommand): Promise<void> {
    const { subjectId, version, occurredAt, payload } = command;

    await this.ledger.handleEnqueue({
      operationKey: `product-published:${subjectId}:${version}`,
      subjectType: LedgerSubjectTypeEnum.PRODUCT,
      subjectId,
      action: LedgerActionEnum.PRODUCT_PUBLISHED,
      payload,
      occurredAt,
    });
  }
}
