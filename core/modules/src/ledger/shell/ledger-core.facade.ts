import { Injectable } from '@nestjs/common';

import type { ILedgerCoreAppendEnqueueCommand, ILedgerCorePort } from '@acme-core/contracts/ledger';

import { LedgerCoreAppendEnqueueUseCase } from '../application';

@Injectable()
export class LedgerCoreFacade implements ILedgerCorePort {
  constructor(private readonly appendEnqueue: LedgerCoreAppendEnqueueUseCase) {}

  public async handleAppendEnqueue(command: ILedgerCoreAppendEnqueueCommand): Promise<void> {
    await this.appendEnqueue.execute(command);
  }
}
