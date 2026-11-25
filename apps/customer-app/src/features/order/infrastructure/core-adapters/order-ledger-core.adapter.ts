import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  ORDER_LEDGER_PORT,
  type IOrderLedgerAppendPlacedCommand,
  type IOrderLedgerPort,
} from '../../outbound';

@Injectable()
export class OrderLedgerCoreAdapter implements IOrderLedgerPort {
  public static readonly PROVIDER: ClassProvider<IOrderLedgerPort> = {
    provide: ORDER_LEDGER_PORT,
    useClass: OrderLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async appendPlaced(command: IOrderLedgerAppendPlacedCommand): Promise<void> {
    const { subjectId, occurredAt, payload } = command;

    await this.ledger.handleAppendEnqueue({
      operationKey: `order-placed:${subjectId}`,
      subjectType: LedgerSubjectTypeEnum.ORDER,
      subjectId,
      action: LedgerActionEnum.ORDER_PLACED,
      payload,
      occurredAt,
    });
  }
}
