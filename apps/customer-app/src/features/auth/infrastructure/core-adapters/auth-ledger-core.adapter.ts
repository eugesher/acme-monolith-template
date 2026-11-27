import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import {
  AUTH_LEDGER_PORT,
  type IAuthLedgerAppendRegisteredCommand,
  type IAuthLedgerPort,
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

  public async appendRegistered(command: IAuthLedgerAppendRegisteredCommand): Promise<void> {
    const { subjectId, occurredAt } = command;

    await this.ledger.appendEnqueue({
      operationKey: `customer-registered:${subjectId}`,
      subjectType: LedgerSubjectTypeEnum.CUSTOMER,
      subjectId,
      action: LedgerActionEnum.CUSTOMER_REGISTERED,
      payload: {},
      occurredAt,
    });
  }
}
