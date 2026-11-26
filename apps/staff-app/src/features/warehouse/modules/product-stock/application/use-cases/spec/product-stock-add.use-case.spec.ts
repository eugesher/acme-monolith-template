import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  ProductStockIdempotencyOutcomeEnum,
  type IProductStockAddRepositoryPort,
  type IProductStockIdempotencyOutcomeView,
  type IProductStockIdempotencyPort,
  type IProductStockLedgerPort,
  type IProductStockMovementPort,
  type IProductStockTransactionPort,
} from '../../../outbound';
import { ProductStockAddUseCase } from '../product-stock-add.use-case';

describe('ProductStockAddUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IProductStockAddRepositoryPort>;
  let movement: jest.Mocked<IProductStockMovementPort>;
  let idempotency: jest.Mocked<IProductStockIdempotencyPort>;
  let ledger: jest.Mocked<IProductStockLedgerPort>;
  let transaction: jest.Mocked<IProductStockTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: ProductStockAddUseCase;

  beforeEach(() => {
    calls = [];
    repository = { findOne: jest.fn() };
    repository.findOne.mockImplementation(() => {
      calls.push('findOne');

      return Promise.resolve({ id: '12', sku: 'SKU-0001' });
    });
    movement = { lock: jest.fn(), add: jest.fn() };
    movement.lock.mockImplementation(() => {
      calls.push('lock');

      return Promise.resolve();
    });
    movement.add.mockImplementation(() => {
      calls.push('add');

      return Promise.resolve({
        productStockId: '700',
        createdAt: '2026-01-05T08:00:00.000Z',
        quantity: 15,
      });
    });
    idempotency = { claim: jest.fn(), complete: jest.fn(), release: jest.fn() };
    idempotency.claim.mockImplementation(() => {
      calls.push('claim');

      return Promise.resolve({ outcome: ProductStockIdempotencyOutcomeEnum.CLAIMED });
    });
    idempotency.complete.mockImplementation(() => {
      calls.push('complete');

      return Promise.resolve();
    });
    idempotency.release.mockImplementation(() => {
      calls.push('release');

      return Promise.resolve();
    });
    ledger = { appendAdded: jest.fn() };
    ledger.appendAdded.mockImplementation(() => {
      calls.push('appendAdded');

      return Promise.resolve();
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();
    useCase = new ProductStockAddUseCase(
      repository,
      movement,
      idempotency,
      ledger,
      transaction,
      logger,
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

      expect(idempotency.claim).toHaveBeenCalledWith({
        staffUserId: 'staff-1',
        key: 'key-1',
        body: { productId: '12', quantity: 5 },
      });
      expect(movement.lock).toHaveBeenCalledWith({ productId: '12' });
      expect(repository.findOne).toHaveBeenCalledWith('12');
      expect(movement.add).toHaveBeenCalledWith({ productId: '12', quantity: 5 });
      expect(view).toEqual({ productId: '12', quantity: 15 });
      expect(idempotency.complete).toHaveBeenCalledWith({
        staffUserId: 'staff-1',
        key: 'key-1',
        response: view,
      });
      expect(calls).toEqual([
        'claim',
        'begin',
        'lock',
        'findOne',
        'add',
        'complete',
        'commit',
        'appendAdded',
      ]);
    });

    it('records the restock under the stock row in the ledger after the commit and logs it', async () => {
      await useCase.execute({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });

      expect(ledger.appendAdded).toHaveBeenCalledWith({
        productStockId: '700',
        subjectId: '12',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', quantity: 5 },
      });
      expect(calls.slice(calls.indexOf('commit'))).toEqual(['commit', 'appendAdded']);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '700', productId: '12', quantity: 5 },
        'Product restocked',
      );
    });

    it('answers a replay with the stored response and does nothing else', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: ProductStockIdempotencyOutcomeEnum.REPLAY,
        storedResponse: { productId: '12', quantity: 10 },
      });

      const view = await useCase.execute({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });

      expect(view).toEqual({ productId: '12', quantity: 10 });
      expect(movement.lock).not.toHaveBeenCalled();
      expect(ledger.appendAdded).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        { idempotencyKey: 'key-1' },
        'Product restock replayed from the idempotency store',
      );
    });

    it.each<[IProductStockIdempotencyOutcomeView['outcome'], string, string]>([
      [
        ProductStockIdempotencyOutcomeEnum.IN_FLIGHT,
        'IDEMPOTENT_REQUEST_IN_FLIGHT',
        'Idempotency-Key key-1 is still being processed, retry shortly',
      ],
      [
        ProductStockIdempotencyOutcomeEnum.MISMATCH,
        'IDEMPOTENCY_KEY_REUSED',
        'Idempotency-Key key-1 was already used with a different request body',
      ],
    ])('refuses an %s key with %s and keeps the key', async (outcome, code, message) => {
      idempotency.claim.mockResolvedValue({ outcome });

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({ code, message });
      expect(movement.lock).not.toHaveBeenCalled();
      expect(idempotency.release).not.toHaveBeenCalled();
    });

    it('refuses an unknown product with PRODUCT_STOCK_PRODUCT_NOT_FOUND and releases the key', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        useCase.execute({
          productId: '999',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({
        code: 'PRODUCT_STOCK_PRODUCT_NOT_FOUND',
        message: 'Product 999 was not found',
      });
      expect(movement.add).not.toHaveBeenCalled();
      expect(idempotency.release).toHaveBeenCalledWith({ staffUserId: 'staff-1', key: 'key-1' });
    });

    it('releases the key when the transaction fails and rethrows', async () => {
      idempotency.complete.mockRejectedValue(new Error('lock wait timeout'));

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('lock wait timeout');
      expect(idempotency.release).toHaveBeenCalledWith({ staffUserId: 'staff-1', key: 'key-1' });
      expect(ledger.appendAdded).not.toHaveBeenCalled();
    });

    it('keeps the completed key when the ledger fails after the commit and rethrows', async () => {
      ledger.appendAdded.mockRejectedValue(new Error('ledger down'));

      await expect(
        useCase.execute({
          productId: '12',
          quantity: 5,
          staffUserId: 'staff-1',
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('ledger down');
      expect(idempotency.complete).toHaveBeenCalledTimes(1);
      expect(idempotency.release).not.toHaveBeenCalled();
    });
  });
});
