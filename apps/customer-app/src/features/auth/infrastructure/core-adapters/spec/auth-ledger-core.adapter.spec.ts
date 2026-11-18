import { AuthLedgerCoreAdapter } from '../auth-ledger-core.adapter';

describe('AuthLedgerCoreAdapter', () => {
  let handleEnqueue: jest.Mock;
  let adapter: AuthLedgerCoreAdapter;

  beforeEach(() => {
    handleEnqueue = jest.fn().mockResolvedValue(undefined);
    adapter = new AuthLedgerCoreAdapter({ handleEnqueue });
  });

  describe('recordRegistered', () => {
    it('enqueues the registration under the operation key and correlation id', async () => {
      await adapter.recordRegistered({
        subjectId: 'customer-1',
        occurredAt: '2026-01-05T08:00:00.000Z',
      });

      expect(handleEnqueue).toHaveBeenCalledTimes(1);
      expect(handleEnqueue).toHaveBeenCalledWith({
        operationKey: 'customer-registered:customer-1',
        subjectType: 'customer',
        subjectId: 'customer-1',
        action: 'CustomerRegistered',
        payload: {},
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });
});
