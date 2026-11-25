import { Injectable } from '@nestjs/common';

import type { ITransactionPort } from '@acme-libs/contracts/local-storage';

import {
  LocalStorageTransactionalAfterCommitUseCase,
  LocalStorageTransactionalRunUseCase,
} from '../application';

@Injectable()
export class LocalStorageTransactionalFacade implements ITransactionPort {
  constructor(
    private readonly runCase: LocalStorageTransactionalRunUseCase,
    private readonly afterCommitCase: LocalStorageTransactionalAfterCommitUseCase,
  ) {}

  public async run<T>(work: () => Promise<T>): Promise<T> {
    return await this.runCase.execute(work);
  }

  public afterCommit(hook: () => Promise<void>): void {
    this.afterCommitCase.execute(hook);
  }
}
