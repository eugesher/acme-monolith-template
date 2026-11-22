import {
  IDEMPOTENCY_PURGE_IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES_TOKEN,
  IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN,
} from '../../../outbound';
import {
  IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
} from '../idempotency-purge-config.provider';

describe('idempotency config providers', () => {
  let getOrThrow: jest.Mock;

  beforeEach(() => {
    getOrThrow = jest.fn().mockReturnValue(7);
  });

  describe('IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider', () => {
    it('provides IDEMPOTENCY_KEY_TTL_HOURS under the idempotency token', () => {
      const value = IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider.useFactory({ getOrThrow });

      expect(IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider.provide).toBe(
        IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN,
      );
      expect(value).toBe(7);
      expect(getOrThrow).toHaveBeenCalledWith('IDEMPOTENCY_KEY_TTL_HOURS');
    });
  });

  describe('IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider', () => {
    it('provides IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES under the in-flight token', () => {
      const value = IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider.useFactory({
        getOrThrow,
      });

      expect(IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider.provide).toBe(
        IDEMPOTENCY_PURGE_IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES_TOKEN,
      );
      expect(value).toBe(7);
      expect(getOrThrow).toHaveBeenCalledWith('IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES');
    });
  });
});
