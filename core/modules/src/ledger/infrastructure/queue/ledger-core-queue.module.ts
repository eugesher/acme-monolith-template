import { Module, type ClassProvider } from '@nestjs/common';

import { LedgerQueueModule } from '@acme-core/queues';

import { LEDGER_CORE_QUEUE_PORT, type ILedgerCoreQueuePort } from '../../outbound';
import { LedgerCoreQueueAdapter } from './ledger-core-queue.adapter';

@Module({
  imports: [LedgerQueueModule],
  exports: [LEDGER_CORE_QUEUE_PORT],
  providers: [
    {
      provide: LEDGER_CORE_QUEUE_PORT,
      useClass: LedgerCoreQueueAdapter,
    } satisfies ClassProvider<ILedgerCoreQueuePort>,
  ],
})
export class LedgerCoreQueueModule {}
