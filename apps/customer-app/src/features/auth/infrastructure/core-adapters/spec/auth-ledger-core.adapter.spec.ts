import type { ILedgerCorePort } from '@acme-core/contracts/ledger';

import { AuthLedgerCoreAdapter } from '../auth-ledger-core.adapter';

describe('AuthLedgerCoreAdapter', () => {
  let ledger: jest.Mocked<ILedgerCorePort>;
  let adapter: AuthLedgerCoreAdapter;

  beforeEach(() => {
    ledger = { handleAppendEnqueue: jest.fn() };
    ledger.handleAppendEnqueue.mockResolvedValue(undefined);
    adapter = new AuthLedgerCoreAdapter(ledger);
  });

  describe('appendRegistered', () => {
    it('enqueues the registration under the operation key and correlation id', async () => {
      await adapter.appendRegistered({
        subjectId: 'customer-1',
        occurredAt: '2026-01-05T08:00:00.000Z',
      });

      expect(ledger.handleAppendEnqueue).toHaveBeenCalledTimes(1);
      expect(ledger.handleAppendEnqueue).toHaveBeenCalledWith({
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
