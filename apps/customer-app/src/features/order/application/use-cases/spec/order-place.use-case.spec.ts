import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  OrderIdempotencyOutcomeEnum,
  type IOrderIdempotencyOutcomeView,
  type IOrderIdempotencyPort,
  type IOrderLedgerPort,
  type IOrderPlaceRepositoryPort,
  type IOrderProductStockPort,
  type IOrderTransactionPort,
} from '../../../outbound';
import { OrderPlaceUseCase } from '../order-place.use-case';

describe('OrderPlaceUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IOrderPlaceRepositoryPort>;
  let productStock: jest.Mocked<IOrderProductStockPort>;
  let idempotency: jest.Mocked<IOrderIdempotencyPort>;
  let ledger: jest.Mocked<IOrderLedgerPort>;
  let transaction: jest.Mocked<IOrderTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: OrderPlaceUseCase;

  beforeEach(() => {
    calls = [];
    repository = {
      findActiveProducts: jest.fn(),
      insertOrder: jest.fn(),
      insertOrderProducts: jest.fn(),
      findPlaced: jest.fn(),
    };
    repository.findActiveProducts.mockImplementation(() => {
      calls.push('findActiveProducts');

      return Promise.resolve([{ id: '100' }, { id: '103' }]);
    });
    repository.insertOrder.mockImplementation(() => {
      calls.push('insertOrder');

      return Promise.resolve('610');
    });
    repository.insertOrderProducts.mockImplementation(() => {
      calls.push('insertOrderProducts');

      return Promise.resolve();
    });
    repository.findPlaced.mockImplementation(() => {
      calls.push('findPlaced');

      return Promise.resolve({
        id: '610',
        customerId: 'customer-1',
        createdAt: new Date('2026-01-05T08:00:00.000Z'),
        orderProducts: [
          { id: '620', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
          { id: '621', product: { id: '103', sku: 'SKU-0004', name: 'Chair' } },
          { id: '622', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });
    });
    productStock = { lock: jest.fn(), withdraw: jest.fn() };
    productStock.lock.mockImplementation(() => {
      calls.push('lock');

      return Promise.resolve([
        { productId: '100', quantity: 8 },
        { productId: '103', quantity: 3 },
      ]);
    });
    productStock.withdraw.mockImplementation(() => {
      calls.push('withdraw');

      return Promise.resolve();
    });
    idempotency = { claim: jest.fn(), complete: jest.fn(), release: jest.fn() };
    idempotency.claim.mockImplementation(() => {
      calls.push('claim');

      return Promise.resolve({ outcome: OrderIdempotencyOutcomeEnum.CLAIMED });
    });
    idempotency.complete.mockImplementation(() => {
      calls.push('complete');

      return Promise.resolve();
    });
    idempotency.release.mockImplementation(() => {
      calls.push('release');

      return Promise.resolve();
    });
    ledger = { recordPlaced: jest.fn() };
    ledger.recordPlaced.mockImplementation(() => {
      calls.push('recordPlaced');

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
    useCase = new OrderPlaceUseCase(
      repository,
      productStock,
      idempotency,
      ledger,
      transaction,
      logger,
    );
  });

  describe('execute', () => {
    it('claims the key, locks the distinct products, places the order, withdraws the stock and completes the key in one transaction', async () => {
      const view = await useCase.execute({
        customerId: 'customer-1',
        productIds: ['100', '103', '100'],
        idempotencyKey: 'key-1',
      });

      expect(idempotency.claim).toHaveBeenCalledWith({
        customerId: 'customer-1',
        key: 'key-1',
        body: { productIds: ['100', '103', '100'] },
      });
      expect(productStock.lock).toHaveBeenCalledWith({ productIds: ['100', '103'] });
      expect(repository.findActiveProducts).toHaveBeenCalledWith(['100', '103']);
      expect(repository.insertOrder).toHaveBeenCalledWith({ customerId: 'customer-1' });
      expect(repository.insertOrderProducts).toHaveBeenCalledWith([
        { orderId: '610', productId: '100' },
        { orderId: '610', productId: '103' },
        { orderId: '610', productId: '100' },
      ]);
      expect(repository.findPlaced).toHaveBeenCalledWith('610');
      expect(view).toEqual({
        id: '610',
        createdAt: '2026-01-05T08:00:00.000Z',
        orderProducts: [
          { id: '620', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
          { id: '621', product: { id: '103', sku: 'SKU-0004', name: 'Chair' } },
          { id: '622', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } },
        ],
      });
      expect(productStock.withdraw).toHaveBeenCalledWith({
        movements: [
          { productId: '100', orderProductId: '620' },
          { productId: '103', orderProductId: '621' },
          { productId: '100', orderProductId: '622' },
        ],
      });
      expect(idempotency.complete).toHaveBeenCalledWith({
        customerId: 'customer-1',
        key: 'key-1',
        response: view,
      });
      expect(calls).toEqual([
        'claim',
        'begin',
        'lock',
        'findActiveProducts',
        'insertOrder',
        'insertOrderProducts',
        'findPlaced',
        'withdraw',
        'complete',
        'commit',
        'recordPlaced',
      ]);
    });

    it('records the placed order in the ledger after the commit and logs it', async () => {
      await useCase.execute({
        customerId: 'customer-1',
        productIds: ['100', '103', '100'],
        idempotencyKey: 'key-1',
      });

      expect(ledger.recordPlaced).toHaveBeenCalledWith({
        subjectId: '610',
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: {
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', product: { id: '100' } },
            { id: '621', product: { id: '103' } },
            { id: '622', product: { id: '100' } },
          ],
        },
      });
      expect(calls.slice(calls.indexOf('commit'))).toEqual(['commit', 'recordPlaced']);
      expect(logger.info).toHaveBeenCalledWith(
        {
          id: '610',
          createdAt: '2026-01-05T08:00:00.000Z',
          customerId: 'customer-1',
          orderProducts: [
            { id: '620', product: { id: '100' } },
            { id: '621', product: { id: '103' } },
            { id: '622', product: { id: '100' } },
          ],
        },
        'Order placed',
      );
    });

    it('answers a replay with the stored response and does nothing else', async () => {
      idempotency.claim.mockResolvedValue({
        outcome: OrderIdempotencyOutcomeEnum.REPLAY,
        storedResponse: { id: '610' },
      });

      const view = await useCase.execute({
        customerId: 'customer-1',
        productIds: ['100'],
        idempotencyKey: 'key-1',
      });

      expect(view).toEqual({ id: '610' });
      expect(productStock.lock).not.toHaveBeenCalled();
      expect(repository.insertOrder).not.toHaveBeenCalled();
      expect(ledger.recordPlaced).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        { idempotencyKey: 'key-1' },
        'Order placement replayed from the idempotency store',
      );
    });

    it.each<[IOrderIdempotencyOutcomeView['outcome'], string, string]>([
      [
        OrderIdempotencyOutcomeEnum.IN_FLIGHT,
        'IDEMPOTENT_REQUEST_IN_FLIGHT',
        'Idempotency-Key key-1 is still being processed, retry shortly',
      ],
      [
        OrderIdempotencyOutcomeEnum.MISMATCH,
        'IDEMPOTENCY_KEY_REUSED',
        'Idempotency-Key key-1 was already used with a different request body',
      ],
    ])('refuses an %s key with %s and keeps the key', async (outcome, code, message) => {
      idempotency.claim.mockResolvedValue({ outcome });

      await expect(
        useCase.execute({
          customerId: 'customer-1',
          productIds: ['100'],
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({ code, message });
      expect(productStock.lock).not.toHaveBeenCalled();
      expect(idempotency.release).not.toHaveBeenCalled();
    });

    it('refuses more units than in stock inside the transaction, writes nothing and releases the key', async () => {
      await expect(
        useCase.execute({
          customerId: 'customer-1',
          productIds: ['103', '103', '103', '103'],
          idempotencyKey: 'key-1',
        }),
      ).rejects.toMatchObject({
        code: 'ORDER_STOCK_INSUFFICIENT',
        message: 'Product 103 has 3 in stock, 4 requested',
      });
      expect(calls).toEqual(['claim', 'begin', 'lock', 'findActiveProducts', 'release']);
      expect(idempotency.release).toHaveBeenCalledWith({ customerId: 'customer-1', key: 'key-1' });
    });

    it('releases the key when the transaction fails and rethrows', async () => {
      idempotency.complete.mockRejectedValue(new Error('lock wait timeout'));

      await expect(
        useCase.execute({
          customerId: 'customer-1',
          productIds: ['100'],
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('lock wait timeout');
      expect(idempotency.release).toHaveBeenCalledWith({ customerId: 'customer-1', key: 'key-1' });
      expect(ledger.recordPlaced).not.toHaveBeenCalled();
    });

    it('rejects with the failure of the release when the key cannot be released', async () => {
      idempotency.complete.mockRejectedValue(new Error('lock wait timeout'));
      idempotency.release.mockRejectedValue(new Error('connection lost'));

      await expect(
        useCase.execute({
          customerId: 'customer-1',
          productIds: ['100'],
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('connection lost');
    });

    it('keeps the completed key when the ledger fails after the commit and rethrows', async () => {
      ledger.recordPlaced.mockRejectedValue(new Error('ledger down'));

      await expect(
        useCase.execute({
          customerId: 'customer-1',
          productIds: ['100'],
          idempotencyKey: 'key-1',
        }),
      ).rejects.toThrow('ledger down');
      expect(idempotency.complete).toHaveBeenCalledTimes(1);
      expect(idempotency.release).not.toHaveBeenCalled();
    });
  });
});
