import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductStockPostSubtractUseCase } from '../product-stock-post-subtract.use-case';
import type {
  IProductStockPostSubtractArchivePort,
  IProductStockPostSubtractOnHandPort,
  IProductStockPostSubtractRepositoryPort,
  IProductStockPostSubtractTransactionPort,
} from '../../../outbound';

describe('ProductStockPostSubtractUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IProductStockPostSubtractRepositoryPort>;
  let onHand: jest.Mocked<IProductStockPostSubtractOnHandPort>;
  let archive: jest.Mocked<IProductStockPostSubtractArchivePort>;
  let transaction: jest.Mocked<IProductStockPostSubtractTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: ProductStockPostSubtractUseCase;

  beforeEach(() => {
    calls = [];
    repository = { findActiveMany: jest.fn() };
    repository.findActiveMany.mockImplementation((productIds: string[]) => {
      calls.push('findActiveMany');

      const active = productIds.filter((productId) => productId !== '102');

      return Promise.resolve(active.map((id) => ({ id })));
    });
    onHand = { lock: jest.fn() };
    onHand.lock.mockImplementation(() => {
      calls.push('lock');

      return Promise.resolve([
        { productId: '100', quantity: 6 },
        { productId: '102', quantity: 0 },
        { productId: '106', quantity: 0 },
        { productId: '107', quantity: -1 },
      ]);
    });
    archive = { archive: jest.fn() };
    archive.archive.mockImplementation(() => {
      calls.push('archive');

      return Promise.resolve({ archived: true });
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();
    useCase = new ProductStockPostSubtractUseCase(repository, onHand, archive, transaction, logger);
  });

  describe('execute', () => {
    it('locks the products and sums their stock before it reads their status', async () => {
      await useCase.execute({ productIds: ['100', '102', '106', '107'] });

      expect(onHand.lock).toHaveBeenCalledWith({ productIds: ['100', '102', '106', '107'] });
      expect(repository.findActiveMany).toHaveBeenCalledWith(['102', '106', '107']);
      expect(calls).toEqual(['begin', 'lock', 'findActiveMany', 'archive', 'archive', 'commit']);
    });

    it('archives the published products that have no stock left and logs each one', async () => {
      await useCase.execute({ productIds: ['100', '102', '106', '107'] });

      expect(archive.archive.mock.calls).toEqual([[{ productId: '106' }], [{ productId: '107' }]]);
      expect(logger.info).toHaveBeenCalledWith(
        { productId: '106' },
        'Out-of-stock product archived',
      );
      expect(logger.info).toHaveBeenCalledWith(
        { productId: '107' },
        'Out-of-stock product archived',
      );
    });

    it('leaves a draft without stock as it is', async () => {
      onHand.lock.mockResolvedValue([{ productId: '102', quantity: 0 }]);

      await useCase.execute({ productIds: ['102'] });

      expect(archive.archive).not.toHaveBeenCalled();
    });

    it('logs nothing for a product the core module did not archive', async () => {
      archive.archive.mockResolvedValue({ archived: false });

      await useCase.execute({ productIds: ['106'] });

      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
