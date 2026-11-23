import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import {
  LEDGER_CORE_PORT,
  LedgerCoreActionEnum,
  LedgerCoreSubjectTypeEnum,
  type ILedgerCorePort,
} from '@acme-core/contracts/ledger';

import {
  AUTH_LEDGER_PORT,
  type IAuthLedgerPort,
  type IAuthLedgerRecordRegisteredCommand,
} from '../../outbound';

@Injectable()
export class AuthLedgerCoreAdapter implements IAuthLedgerPort {
  public static readonly PROVIDER: ClassProvider<IAuthLedgerPort> = {
    provide: AUTH_LEDGER_PORT,
    useClass: AuthLedgerCoreAdapter,
  };

  constructor(
    @Inject(LEDGER_CORE_PORT)
    private readonly ledger: ILedgerCorePort,
  ) {}

  public async recordRegistered(command: IAuthLedgerRecordRegisteredCommand): Promise<void> {
    const { subjectId, occurredAt } = command;

    await this.ledger.handleEnqueue({
      operationKey: `customer-registered:${subjectId}`,
      subjectType: LedgerCoreSubjectTypeEnum.CUSTOMER,
      subjectId,
      action: LedgerCoreActionEnum.CUSTOMER_REGISTERED,
      payload: {},
      occurredAt,
    });
  }
}
