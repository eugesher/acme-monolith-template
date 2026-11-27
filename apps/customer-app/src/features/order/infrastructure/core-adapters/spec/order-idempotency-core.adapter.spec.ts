import {
  IdempotencyCoreClaimOutcomeEnum,
  type IIdempotencyCorePort,
} from '@acme-core/contracts/idempotency';

import { OrderIdempotencyCoreAdapter } from '../order-idempotency-core.adapter';

describe('OrderIdempotencyCoreAdapter', () => {
  let idempotency: jest.Mocked<IIdempotencyCorePort>;
  let adapter: OrderIdempotencyCoreAdapter;

  beforeEach(() => {
    idempotency = { claim: jest.fn(), complete: jest.fn(), release: jest.fn() };
    adapter = new OrderIdempotencyCoreAdapter(idempotency);
  });

  describe('claim', () => {
    it('claims the key in the scope of the owner on the logical body', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: IdempotencyCoreClaimOutcomeEnum.CLAIMED,
        storedResponse: undefined,
      });

      const outcome = await adapter.claim({
        customerId: '101',
        key: 'key-1',
        body: { productIds: ['100'] },
      });

      expect(outcome).toEqual({ outcome: 'claimed' });
      expect(idempotency.claim).toHaveBeenCalledWith({
        scope: 'customer:101',
        key: 'key-1',
        body: { productIds: ['100'] },
      });
    });

    it.each([
      [IdempotencyCoreClaimOutcomeEnum.IN_FLIGHT, 'in-flight'],
      [IdempotencyCoreClaimOutcomeEnum.MISMATCH, 'mismatch'],
    ])('answers %s as %s without a stored response', async (core, outcome) => {
      idempotency.claim.mockResolvedValue({ outcome: core, storedResponse: undefined });

      const result = await adapter.claim({ customerId: '101', key: 'key-1', body: {} });

      expect(result).toEqual({ outcome });
    });

    it('answers a replay with the stored response', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: IdempotencyCoreClaimOutcomeEnum.REPLAY,
        storedResponse: { id: '600', orderProducts: [] },
      });

      const result = await adapter.claim({ customerId: '101', key: 'key-1', body: {} });

      expect(result).toEqual({
        outcome: 'replay',
        storedResponse: { id: '600', orderProducts: [] },
      });
    });
  });

  describe('complete', () => {
    it('stores the response under the key in the scope of the owner', async () => {
      idempotency.complete.mockResolvedValue(undefined);

      await adapter.complete({ customerId: '101', key: 'key-1', response: { id: '600' } });

      expect(idempotency.complete).toHaveBeenCalledWith({
        scope: 'customer:101',
        key: 'key-1',
        response: { id: '600' },
      });
    });

    it('lets a failed write reject', async () => {
      idempotency.complete.mockRejectedValue(new Error('connection lost'));

      const complete = adapter.complete({ customerId: '101', key: 'key-1', response: {} });

      await expect(complete).rejects.toThrow('connection lost');
    });
  });

  describe('release', () => {
    it('releases the key in the scope of the owner', async () => {
      idempotency.release.mockResolvedValue(undefined);

      await adapter.release({ customerId: '101', key: 'key-1' });

      expect(idempotency.release).toHaveBeenCalledWith({
        scope: 'customer:101',
        key: 'key-1',
      });
    });
  });
});
