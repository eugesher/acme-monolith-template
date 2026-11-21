import { Module } from '@nestjs/common';

import { LEDGER_CORE_PORT } from '@acme-core/contracts/ledger';

import { LedgerCoreEnqueueUseCase } from '../application';
import {
  LedgerCoreConfigEnqueueRetryAttemptsProvider,
  LedgerCoreConfigRedisCommandTimeoutMsProvider,
  LedgerCoreQueueModule,
} from '../infrastructure';
import { LedgerCoreFacade } from './ledger-core.facade';

@Module({
  imports: [LedgerCoreQueueModule],
  exports: [LEDGER_CORE_PORT],
  providers: [
    { provide: LEDGER_CORE_PORT, useClass: LedgerCoreFacade },
    LedgerCoreEnqueueUseCase,
    LedgerCoreConfigRedisCommandTimeoutMsProvider,
    LedgerCoreConfigEnqueueRetryAttemptsProvider,
  ],
})
export class LedgerCoreModule {}
