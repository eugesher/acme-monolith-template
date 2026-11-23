import { Module, type ClassProvider } from '@nestjs/common';

import { LedgerQueueModule } from '@acme-core/queues';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import { LedgerCoreEnqueueUseCase } from '../application';
import {
  LedgerCoreConfigEnqueueRetryAttemptsProvider,
  LedgerCoreConfigRedisCommandTimeoutMsProvider,
  LedgerCoreQueueAdapter,
} from '../infrastructure';
import { LedgerCoreFacade } from './ledger-core.facade';

@Module({
  imports: [LedgerQueueModule],
  exports: [LEDGER_CORE_PORT],
  providers: [
    {
      provide: LEDGER_CORE_PORT,
      useClass: LedgerCoreFacade,
    } satisfies ClassProvider<ILedgerCorePort>,
    LedgerCoreEnqueueUseCase,
    LedgerCoreQueueAdapter.provider,
    LedgerCoreConfigRedisCommandTimeoutMsProvider,
    LedgerCoreConfigEnqueueRetryAttemptsProvider,
  ],
})
export class LedgerCoreModule {}
