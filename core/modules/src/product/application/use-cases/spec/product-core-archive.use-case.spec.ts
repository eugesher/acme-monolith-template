import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductCoreArchiveUseCase } from '../product-core-archive.use-case';
import type {
  IProductCoreArchiveRepositoryPort,
  IProductCoreCatalogCachePort,
  IProductCoreLedgerPort,
  IProductCoreTransactionPort,
} from '../../../outbound';

describe('ProductCoreArchiveUseCase', () => {
  let calls: string[];
  let hooks: (() => Promise<void>)[];
  let repository: jest.Mocked<IProductCoreArchiveRepositoryPort>;
  let catalogCache: jest.Mocked<IProductCoreCatalogCachePort>;
  let ledger: jest.Mocked<IProductCoreLedgerPort>;
  let transaction: jest.Mocked<IProductCoreTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: ProductCoreArchiveUseCase;

  beforeEach(() => {
    calls = [];
    hooks = [];
    repository = { lockOne: jest.fn(), update: jest.fn(), findOne: jest.fn() };
    repository.lockOne.mockImplementation(() => {
      calls.push('lockOne');

      return Promise.resolve({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });
    repository.update.mockImplementation(() => {
      calls.push('update');

      return Promise.resolve();
    });
    repository.findOne.mockImplementation(() => {
      calls.push('findOne');

      return Promise.resolve({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 4,
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      });
    });
    catalogCache = { invalidate: jest.fn() };
    catalogCache.invalidate.mockImplementation(() => {
      calls.push('invalidate');

      return Promise.resolve();
    });
    ledger = { appendArchived: jest.fn() };
    ledger.appendArchived.mockImplementation(() => {
      calls.push('appendArchived');

      return Promise.resolve();
    });
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      for (const hook of hooks) {
        await hook();
      }

      return result;
    });
    transaction.afterCommit.mockImplementation((hook) => hooks.push(hook));
    logger = makePinoLoggerMock();
    useCase = new ProductCoreArchiveUseCase(repository, catalogCache, ledger, transaction, logger);
  });

  describe('execute', () => {
    it('archives the locked product, bumps its version and answers archived', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 3 });

      expect(view).toEqual({ outcome: 'archived', currentVersion: 4 });
      expect(repository.lockOne).toHaveBeenCalledWith('12');
      expect(repository.update).toHaveBeenCalledWith({
        id: '12',
        versionAsRead: 3,
        status: 'archived',
        version: 4,
      });
      expect(logger.info).toHaveBeenCalledWith({ id: '12', version: 4 }, 'Product archived');
    });

    it('drops the cached catalog and records the archive at the time of the update only after the commit', async () => {
      await useCase.execute({ productId: '12', expectedVersion: undefined });

      expect(calls).toEqual([
        'begin',
        'lockOne',
        'update',
        'findOne',
        'commit',
        'invalidate',
        'appendArchived',
      ]);
      expect(repository.findOne).toHaveBeenCalledWith('12');
      expect(ledger.appendArchived).toHaveBeenCalledWith({
        subjectId: '12',
        version: 4,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: 'active' },
      });
    });

    it('answers not-found for an unknown product and writes nothing', async () => {
      repository.lockOne.mockResolvedValue(null);

      const view = await useCase.execute({ productId: '99', expectedVersion: undefined });

      expect(view).toEqual({ outcome: 'not-found', currentVersion: undefined });
      expect(repository.update).not.toHaveBeenCalled();
      expect(transaction.afterCommit).not.toHaveBeenCalled();
    });

    it('answers version-mismatch with the current version for a stale expected version', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 2 });

      expect(view).toEqual({ outcome: 'version-mismatch', currentVersion: 3 });
      expect(repository.update).not.toHaveBeenCalled();
      expect(transaction.afterCommit).not.toHaveBeenCalled();
    });

    it('answers already-archived for an archived product and announces nothing', async () => {
      repository.lockOne.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 5,
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      const view = await useCase.execute({ productId: '12', expectedVersion: undefined });

      expect(view).toEqual({ outcome: 'already-archived', currentVersion: 5 });
      expect(repository.update).not.toHaveBeenCalled();
      expect(transaction.afterCommit).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
