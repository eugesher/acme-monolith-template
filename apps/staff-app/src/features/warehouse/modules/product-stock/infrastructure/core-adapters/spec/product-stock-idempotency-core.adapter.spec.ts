import {
  IdempotencyCoreClaimOutcomeEnum,
  type IIdempotencyCorePort,
} from '@acme-core/contracts/idempotency';

import { ProductStockIdempotencyCoreAdapter } from '../product-stock-idempotency-core.adapter';

describe('ProductStockIdempotencyCoreAdapter', () => {
  let idempotency: jest.Mocked<IIdempotencyCorePort>;
  let adapter: ProductStockIdempotencyCoreAdapter;

  beforeEach(() => {
    idempotency = { claim: jest.fn(), complete: jest.fn(), release: jest.fn() };
    adapter = new ProductStockIdempotencyCoreAdapter(idempotency);
  });

  describe('claim', () => {
    it('claims the key in the scope of the owner on the logical body', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: IdempotencyCoreClaimOutcomeEnum.CLAIMED,
        storedResponse: undefined,
      });

      const outcome = await adapter.claim({
        staffUserId: 'staff-1',
        key: 'key-1',
        body: { productId: '12', quantity: 5 },
      });

      expect(outcome).toEqual({ outcome: 'claimed' });
      expect(idempotency.claim).toHaveBeenCalledWith({
        scope: 'staff:staff-1',
        key: 'key-1',
        body: { productId: '12', quantity: 5 },
      });
    });

    it.each([
      [IdempotencyCoreClaimOutcomeEnum.IN_FLIGHT, 'in-flight'],
      [IdempotencyCoreClaimOutcomeEnum.MISMATCH, 'mismatch'],
    ])('answers %s as %s without a stored response', async (core, outcome) => {
      idempotency.claim.mockResolvedValue({ outcome: core, storedResponse: undefined });

      const result = await adapter.claim({ staffUserId: 'staff-1', key: 'key-1', body: {} });

      expect(result).toEqual({ outcome });
    });

    it('answers a replay with the stored response', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: IdempotencyCoreClaimOutcomeEnum.REPLAY,
        storedResponse: { productId: '12', quantity: 15 },
      });

      const result = await adapter.claim({ staffUserId: 'staff-1', key: 'key-1', body: {} });

      expect(result).toEqual({
        outcome: 'replay',
        storedResponse: { productId: '12', quantity: 15 },
      });
    });
  });

  describe('complete', () => {
    it('stores the response under the key in the scope of the owner', async () => {
      idempotency.complete.mockResolvedValue(undefined);

      await adapter.complete({
        staffUserId: 'staff-1',
        key: 'key-1',
        response: { productId: '12' },
      });

      expect(idempotency.complete).toHaveBeenCalledWith({
        scope: 'staff:staff-1',
        key: 'key-1',
        response: { productId: '12' },
      });
    });

    it('lets a failed write reject', async () => {
      idempotency.complete.mockRejectedValue(new Error('connection lost'));

      const complete = adapter.complete({ staffUserId: 'staff-1', key: 'key-1', response: {} });

      await expect(complete).rejects.toThrow('connection lost');
    });
  });

  describe('release', () => {
    it('releases the key in the scope of the owner', async () => {
      idempotency.release.mockResolvedValue(undefined);

      await adapter.release({ staffUserId: 'staff-1', key: 'key-1' });

      expect(idempotency.release).toHaveBeenCalledWith({
        scope: 'staff:staff-1',
        key: 'key-1',
      });
    });
  });
});
