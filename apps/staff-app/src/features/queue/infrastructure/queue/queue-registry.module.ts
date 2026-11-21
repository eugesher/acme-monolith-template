import { Module, type ClassProvider } from '@nestjs/common';

import { LedgerQueueModule, ProductStockPostSubtractQueueModule } from '@acme-core/queues';

import { QUEUE_REGISTRY_PORT, type IQueueRegistryPort } from '../../outbound';
import { QueueRegistryAdapter } from './queue-registry.adapter';

@Module({
  imports: [LedgerQueueModule, ProductStockPostSubtractQueueModule],
  exports: [QUEUE_REGISTRY_PORT],
  providers: [
    {
      provide: QUEUE_REGISTRY_PORT,
      useClass: QueueRegistryAdapter,
    } satisfies ClassProvider<IQueueRegistryPort>,
  ],
})
export class QueueRegistryModule {}
