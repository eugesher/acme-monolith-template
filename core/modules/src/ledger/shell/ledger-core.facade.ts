import { Injectable } from '@nestjs/common';

import type { ILedgerCoreAppendEnqueueCommand, ILedgerCorePort } from '@acme-core/contracts/ledger';

import { LedgerCoreAppendEnqueueCase } from '../application';

@Injectable()
export class LedgerCoreFacade implements ILedgerCorePort {
  constructor(private readonly appendEnqueueCase: LedgerCoreAppendEnqueueCase) {}

  public async appendEnqueue(command: ILedgerCoreAppendEnqueueCommand): Promise<void> {
    await this.appendEnqueueCase.execute(command);
  }
}
