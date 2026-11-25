import type { FactoryProvider } from '@nestjs/common';

import { ConfigValueProvider } from '@acme-libs/config';

import {
  LEDGER_CORE_APPEND_ENQUEUE_RETRY_ATTEMPTS_TOKEN,
  LEDGER_CORE_REDIS_COMMAND_TIMEOUT_MS_TOKEN,
} from '../../outbound';

export const LedgerCoreConfigRedisCommandTimeoutMsProvider: FactoryProvider<number> =
  ConfigValueProvider.provide({
    injectionToken: LEDGER_CORE_REDIS_COMMAND_TIMEOUT_MS_TOKEN,
    configProperty: 'REDIS_COMMAND_TIMEOUT_MS',
  });

export const LedgerCoreConfigAppendEnqueueRetryAttemptsProvider: FactoryProvider<number> =
  ConfigValueProvider.provide({
    injectionToken: LEDGER_CORE_APPEND_ENQUEUE_RETRY_ATTEMPTS_TOKEN,
    configProperty: 'ENQUEUE_RETRY_ATTEMPTS',
  });
