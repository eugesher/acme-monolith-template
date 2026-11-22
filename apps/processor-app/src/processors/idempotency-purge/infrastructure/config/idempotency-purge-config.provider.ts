import { ConfigValueProvider } from '@acme-libs/config';

import {
  IDEMPOTENCY_PURGE_IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES_TOKEN,
  IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN,
} from '../../outbound';

export const IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider = ConfigValueProvider.provide({
  injectionToken: IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN,
  configProperty: 'IDEMPOTENCY_KEY_TTL_HOURS',
});

export const IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider =
  ConfigValueProvider.provide({
    injectionToken: IDEMPOTENCY_PURGE_IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES_TOKEN,
    configProperty: 'IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES',
  });
