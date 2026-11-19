import type { PinoLogger } from 'nestjs-pino';

import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductStockAddUseCase } from '../product-stock-add.use-case';

describe('ProductStockAddUseCase', () => {
  let calls: string[];
  let findById: jest.Mock;
  let lock: jest.Mock;
  let add: jest.Mock;
  let claim: jest.Mock;
  let complete: jest.Mock;
  let release: jest.Mock;
  let recordAdded: jest.Mock;
  let run: jest.Mock;
  let logger: PinoLoggerMock;
  let useCase: ProductStockAddUseCase;

  beforeEach(() => {
    calls = [];
    findById = jest.fn(() => {
      calls.push('findById');

      return Promise.resolve({ id: '12', sku: 'SKU-0001' });
    });
    lock = jest.fn(() => {
      calls.push('lock');

      return Promise.resolve();
    });
    add = jest.fn(() => {
      calls.push('add');

      return Promise.resolve({ productStockId: '700', quantity: 15 });
    });
    claim = jest.fn(() => {
      calls.push('claim');

      return Promise.resolve({ outcome: 'claimed' });
    });
    complete = jest.fn(() => {
      calls.push('complete');

      return Promise.resolve();
    });
    release = jest.fn(() => {
      calls.push('release');

      return Promise.resolve();
    });
    recordAdded = jest.fn(() => {
      calls.push('recordAdded');

      return Promise.resolve();
    });
    run = jest.fn(async (work: () => Promise<unknown>) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();
    useCase = new ProductStockAddUseCase(
      { findById },
      { lock, add },
      { claim, complete, release },
      { recordAdded },
      { run },
      logger as unknown as PinoLogger,
    );
  });

  describe('execute', () => {
    it('claims the key, locks the product, writes the movement and completes the key in one transaction', async () => {
      const view = await useCase.execute({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });

      expect(claim).toHaveBeenCalledWith({
        staffUserId: 'staff-1',
        key: 'key-1',
        body: { productId: '12', quantity: 5 },
      });
      expect(lock).toHaveBeenCalledWith({ productId: '12' });
      expect(findById).toHaveBeenCalledWith('12');
      expect(add).toHaveBeenCalledWith({ productId: '12', quantity: 5 });
      expect(view).toEqual({ productId: '12', quantity: 15 });
      expect(complete).toHaveBeenCalledWith({
        staffUserId: 'staff-1',
        key: 'key-1',
        response: view,
      });
      expect(calls).toEqual([
        'claim',
        'begin',
        'lock',
        'findById',
        'add',
        'complete',
        'commit',
        'recordAdded',
      ]);
    });

    it('records the restock under the stock row in the ledger after the commit and logs it', async () => {
      await useCase.execute({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });

      expect(recordAdded).toHaveBeenCalledWith({
        productStockId: '700',
        subjectId: '12',
        payload: { sku: 'SKU-0001', quantity: 5 },
      });
      expect(calls.slice(calls.indexOf('commit'))).toEqual(['commit', 'recordAdded']);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '700', productId: '12', quantity: 5 },
        'Product restocked',
      );
    });

    it('answers a replay with the stored response and does nothing else', async () => {
      claim.mockResolvedValue({
        outcome: 'replay',
        storedResponse: { productId: '12', quantity: 10 },
      });

      const view = await useCase.execute({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });

      expect(view).toEqual({ productId: '12', quantity: 10 });
      expect(lock).not.toHaveBeenCalled();
      expect(recordAdded).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        { idempotencyKey: 'key-1' },
        'Product restock replayed from the idempotency store',
      );
    });

    it.each([
      [
        'in-flight',
        'IDEMPOTENT_REQUEST_IN_FLIGHT',
        'Idempotency-Key key-1 is still being processed, retry shortly',
      ],
      [
        'mismatch',
        'IDEMPOTENCY_KEY_REUSED',
        'Idempotency-Key key-1 was already used with a different request body',
      ],
    ])('refuses an %s key with %s and keeps the key', async (outcome, code, message) => {
      claim.mockResolvedValue({ outcome });

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({ code, message });
      expect(lock).not.toHaveBeenCalled();
      expect(release).not.toHaveBeenCalled();
    });

    it('refuses an unknown product with PRODUCT_NOT_FOUND and releases the key', async () => {
      findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          productId: '999',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product 999 was not found',
      });
      expect(add).not.toHaveBeenCalled();
      expect(release).toHaveBeenCalledWith({ staffUserId: 'staff-1', key: 'key-1' });
    });

    it('releases the key when the transaction fails and rethrows', async () => {
      complete.mockRejectedValue(new Error('lock wait timeout'));

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('lock wait timeout');
      expect(release).toHaveBeenCalledWith({ staffUserId: 'staff-1', key: 'key-1' });
      expect(recordAdded).not.toHaveBeenCalled();
    });

    it('keeps the completed key when the ledger fails after the commit and rethrows', async () => {
      recordAdded.mockRejectedValue(new Error('ledger down'));

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('ledger down');
      expect(complete).toHaveBeenCalledTimes(1);
      expect(release).not.toHaveBeenCalled();
    });
  });
});
