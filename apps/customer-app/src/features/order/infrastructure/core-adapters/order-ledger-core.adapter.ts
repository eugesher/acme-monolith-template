import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import {
  LEDGER_CORE_PORT,
  LedgerCoreActionEnum,
  LedgerCoreSubjectTypeEnum,
  type ILedgerCorePort,
} from '@acme-core/contracts/ledger';

import {
  ORDER_LEDGER_PORT,
  type IOrderLedgerPort,
  type IOrderLedgerRecordPlacedCommand,
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

  public async recordPlaced(command: IOrderLedgerRecordPlacedCommand): Promise<void> {
    const { subjectId, occurredAt, payload } = command;

    await this.ledger.handleEnqueue({
      operationKey: `order-placed:${subjectId}`,
      subjectType: LedgerCoreSubjectTypeEnum.ORDER,
      subjectId,
      action: LedgerCoreActionEnum.ORDER_PLACED,
      payload,
      occurredAt,
    });
  }
}
