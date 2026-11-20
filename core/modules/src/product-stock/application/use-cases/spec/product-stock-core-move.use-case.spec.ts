import { CorrelationContextHelper } from '@acme-libs/observability';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';
import { ProductStockCoreMovementKindEnum } from '@acme-core/contracts/product-stock';

import { ProductStockCoreMoveUseCase } from '../product-stock-core-move.use-case';
import type {
  IProductStockCoreMoveRepositoryPort,
  IProductStockCorePostSubtractPort,
  IProductStockCoreTransactionPort,
} from '../../../outbound';

describe('ProductStockCoreMoveUseCase', () => {
  let repository: jest.Mocked<IProductStockCoreMoveRepositoryPort>;
  let postSubtract: jest.Mocked<IProductStockCorePostSubtractPort>;
  let transaction: jest.Mocked<IProductStockCoreTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: ProductStockCoreMoveUseCase;

  beforeEach(() => {
    repository = { lockProducts: jest.fn(), insertMany: jest.fn(), sumStock: jest.fn() };
    repository.lockProducts.mockResolvedValue([{ id: '100' }, { id: '103' }]);
    repository.insertMany.mockResolvedValue([
      { id: '700', createdAt: new Date('2026-01-05T08:00:00.000Z') },
      { id: '701', createdAt: new Date('2026-01-05T08:00:00.000Z') },
      { id: '702', createdAt: new Date('2026-01-05T08:00:00.000Z') },
    ]);
    repository.sumStock.mockResolvedValue([
      { productId: '100', quantity: 6 },
      { productId: '103', quantity: 2 },
    ]);
    postSubtract = { enqueue: jest.fn() };
    postSubtract.enqueue.mockResolvedValue();
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    logger = makePinoLoggerMock();
    useCase = new ProductStockCoreMoveUseCase(
      repository,
      postSubtract,
      transaction,
      2,
      500,
      logger,
    );
  });

  describe('execute', () => {
    it('locks the distinct products, adds as positive rows and answers the rows and the stock', async () => {
      const view = await useCase.execute({
        kind: ProductStockCoreMovementKindEnum.ADD,
        movements: [
          { productId: '100', quantity: 5, orderProductId: null },
          { productId: '103', quantity: 2, orderProductId: null },
          { productId: '100', quantity: 1, orderProductId: null },
        ],
      });

      expect(repository.lockProducts).toHaveBeenCalledWith(['100', '103']);
      expect(repository.insertMany).toHaveBeenCalledWith([
        { productId: '100', quantity: 5, orderProductId: null },
        { productId: '103', quantity: 2, orderProductId: null },
        { productId: '100', quantity: 1, orderProductId: null },
      ]);
      expect(repository.sumStock).toHaveBeenCalledWith(['100', '103']);
      expect(view).toEqual({
        productStocks: [
          { id: '700', createdAt: '2026-01-05T08:00:00.000Z' },
          { id: '701', createdAt: '2026-01-05T08:00:00.000Z' },
          { id: '702', createdAt: '2026-01-05T08:00:00.000Z' },
        ],
        stock: [
          { productId: '100', quantity: 6 },
          { productId: '103', quantity: 2 },
        ],
      });
    });

    it('subtracts as negative rows', async () => {
      await useCase.execute({
        kind: ProductStockCoreMovementKindEnum.SUBTRACT,
        movements: [
          { productId: '100', quantity: 1, orderProductId: '620' },
          { productId: '103', quantity: 1, orderProductId: '621' },
        ],
      });

      expect(repository.insertMany).toHaveBeenCalledWith([
        { productId: '100', quantity: -1, orderProductId: '620' },
        { productId: '103', quantity: -1, orderProductId: '621' },
      ]);
    });

    it('takes the locks before it writes and sums after the write', async () => {
      await useCase.execute({
        kind: ProductStockCoreMovementKindEnum.ADD,
        movements: [{ productId: '100', quantity: 5, orderProductId: null }],
      });

      expect(repository.lockProducts.mock.invocationCallOrder[0]).toBeLessThan(
        repository.insertMany.mock.invocationCallOrder[0],
      );
      expect(repository.insertMany.mock.invocationCallOrder[0]).toBeLessThan(
        repository.sumStock.mock.invocationCallOrder[0],
      );
    });

    it('lets a failed lock reject before it writes', async () => {
      repository.lockProducts.mockRejectedValue(new Error('lock wait timeout'));

      const move = useCase.execute({
        kind: ProductStockCoreMovementKindEnum.ADD,
        movements: [{ productId: '100', quantity: 5, orderProductId: null }],
      });

      await expect(move).rejects.toThrow('lock wait timeout');
      expect(repository.insertMany).not.toHaveBeenCalled();
    });

    it('announces the subtracted products after the commit, under the correlation id of the request', async () => {
      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          kind: ProductStockCoreMovementKindEnum.SUBTRACT,
          movements: [
            { productId: '100', quantity: 1, orderProductId: '620' },
            { productId: '100', quantity: 1, orderProductId: '621' },
          ],
        }),
      );

      const [hook] = transaction.afterCommit.mock.calls[0];

      expect(postSubtract.enqueue).not.toHaveBeenCalled();

      await hook();

      expect(postSubtract.enqueue).toHaveBeenCalledWith({
        productIds: ['100'],
        correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        timeoutMs: 500,
      });
    });

    it('retries a failed announcement and logs it for a replay once the budget is spent', async () => {
      postSubtract.enqueue.mockRejectedValue(new Error('redis is down'));

      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          kind: ProductStockCoreMovementKindEnum.SUBTRACT,
          movements: [{ productId: '100', quantity: 1, orderProductId: '620' }],
        }),
      );

      const [hook] = transaction.afterCommit.mock.calls[0];

      await hook();

      expect(postSubtract.enqueue).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(
        {
          err: new Error('redis is down'),
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          products: [{ id: '100' }],
        },
        'Post-subtract enqueue failed permanently: the out-of-stock check of these products did not run, replay it',
      );
    });

    it('announces nothing for an addition', async () => {
      await useCase.execute({
        kind: ProductStockCoreMovementKindEnum.ADD,
        movements: [{ productId: '100', quantity: 5, orderProductId: null }],
      });

      expect(transaction.afterCommit).not.toHaveBeenCalled();
    });
  });
});
