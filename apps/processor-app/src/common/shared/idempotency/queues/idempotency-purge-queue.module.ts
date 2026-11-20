import { BullSetupModule } from '@acme-libs/queue';
import { IDEMPOTENCY_PURGE_QUEUE } from '@acme-processor/contracts/idempotency';

export const IdempotencyPurgeQueueModule = BullSetupModule.registerQueue(IDEMPOTENCY_PURGE_QUEUE);
