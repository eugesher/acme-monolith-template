import type { FactoryProvider } from '@nestjs/common';

import { ConfigValueProvider } from '@acme-libs/config';

import { NOTE_OCC_RETRY_ATTEMPTS_TOKEN } from '../../outbound';

export const NoteConfigOccRetryAttemptsProvider: FactoryProvider<number> =
  ConfigValueProvider.provide({
    injectionToken: NOTE_OCC_RETRY_ATTEMPTS_TOKEN,
    configProperty: 'OCC_RETRY_ATTEMPTS',
  });
