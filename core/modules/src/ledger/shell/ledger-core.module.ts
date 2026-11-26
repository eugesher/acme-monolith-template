import { Module, type ClassProvider } from '@nestjs/common';

import { LedgerAppendQueue } from '@acme-core/queues';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import { LedgerCoreAppendEnqueueUseCase } from '../application';
import {
  LedgerCoreConfigAppendEnqueueRetryAttemptsProvider,
  LedgerCoreConfigRedisCommandTimeoutMsProvider,
  LedgerCoreQueueAdapter,
} from '../infrastructure';
import { LedgerCoreFacade } from './ledger-core.facade';

@Module({
  imports: [LedgerAppendQueue.register()],
  exports: [LEDGER_CORE_PORT],
  providers: [
    {
      provide: LEDGER_CORE_PORT,
      useClass: LedgerCoreFacade,
    } satisfies ClassProvider<ILedgerCorePort>,
    LedgerCoreAppendEnqueueUseCase,
    LedgerCoreQueueAdapter.PROVIDER,
    LedgerCoreConfigRedisCommandTimeoutMsProvider,
    LedgerCoreConfigAppendEnqueueRetryAttemptsProvider,
  ],
})
export class LedgerCoreModule {}
