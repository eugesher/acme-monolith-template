import type { DynamicModule } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';
import { LEDGER_RECORD_QUEUE } from '@acme-core/contracts/ledger';

export const LedgerQueueModule: DynamicModule = BullSetupModule.registerQueue(LEDGER_RECORD_QUEUE);
