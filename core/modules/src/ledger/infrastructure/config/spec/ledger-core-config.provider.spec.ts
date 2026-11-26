import {
  LEDGER_CORE_APPEND_ENQUEUE_RETRY_ATTEMPTS_TOKEN,
  LEDGER_CORE_REDIS_COMMAND_TIMEOUT_MS_TOKEN,
} from '../../../outbound';
import {
  LedgerCoreConfigAppendEnqueueRetryAttemptsProvider,
  LedgerCoreConfigRedisCommandTimeoutMsProvider,
} from '../ledger-core-config.provider';

describe('ledger lib config providers', () => {
  let getOrThrow: jest.Mock;

  beforeEach(() => {
    getOrThrow = jest.fn().mockReturnValue(7);
  });

  describe('LedgerCoreConfigRedisCommandTimeoutMsProvider', () => {
    it('provides REDIS_COMMAND_TIMEOUT_MS under the ledger lib token', () => {
      const value = LedgerCoreConfigRedisCommandTimeoutMsProvider.useFactory({ getOrThrow });

      expect(LedgerCoreConfigRedisCommandTimeoutMsProvider.provide).toBe(
        LEDGER_CORE_REDIS_COMMAND_TIMEOUT_MS_TOKEN,
      );
      expect(value).toBe(7);
      expect(getOrThrow).toHaveBeenCalledWith('REDIS_COMMAND_TIMEOUT_MS');
    });
  });

  describe('LedgerCoreConfigAppendEnqueueRetryAttemptsProvider', () => {
    it('provides ENQUEUE_RETRY_ATTEMPTS under the token of the core ledger', () => {
      const value = LedgerCoreConfigAppendEnqueueRetryAttemptsProvider.useFactory({ getOrThrow });

      expect(LedgerCoreConfigAppendEnqueueRetryAttemptsProvider.provide).toBe(
        LEDGER_CORE_APPEND_ENQUEUE_RETRY_ATTEMPTS_TOKEN,
      );
      expect(value).toBe(7);
      expect(getOrThrow).toHaveBeenCalledWith('ENQUEUE_RETRY_ATTEMPTS');
    });
  });
});
