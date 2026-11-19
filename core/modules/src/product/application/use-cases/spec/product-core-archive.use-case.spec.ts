import type { PinoLogger } from 'nestjs-pino';

import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductCoreArchiveUseCase } from '../product-core-archive.use-case';

describe('ProductCoreArchiveUseCase', () => {
  let calls: string[];
  let hooks: (() => Promise<void>)[];
  let lockById: jest.Mock;
  let update: jest.Mock;
  let findById: jest.Mock;
  let recordArchived: jest.Mock;
  let invalidate: jest.Mock;
  let run: jest.Mock;
  let afterCommit: jest.Mock;
  let logger: PinoLoggerMock;
  let useCase: ProductCoreArchiveUseCase;

  beforeEach(() => {
    calls = [];
    hooks = [];
    lockById = jest.fn(() => {
      calls.push('lockById');

      return Promise.resolve({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });
    update = jest.fn(() => {
      calls.push('update');

      return Promise.resolve();
    });
    findById = jest.fn(() => {
      calls.push('findById');

      return Promise.resolve({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 4,
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      });
    });
    recordArchived = jest.fn(() => {
      calls.push('recordArchived');

      return Promise.resolve();
    });
    invalidate = jest.fn(() => {
      calls.push('invalidate');

      return Promise.resolve();
    });
    run = jest.fn(async (work: () => Promise<unknown>) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      for (const hook of hooks) {
        await hook();
      }

      return result;
    });
    afterCommit = jest.fn((hook: () => Promise<void>) => hooks.push(hook));
    logger = makePinoLoggerMock();
    useCase = new ProductCoreArchiveUseCase(
      { lockById, update, findById },
      { invalidate },
      { recordArchived },
      { run, afterCommit },
      logger as unknown as PinoLogger,
    );
  });

  describe('execute', () => {
    it('archives the locked product, bumps its version and answers archived', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 3 });

      expect(view).toEqual({ outcome: 'archived', currentVersion: 4 });
      expect(lockById).toHaveBeenCalledWith('12');
      expect(update).toHaveBeenCalledWith({
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
        'lockById',
        'update',
        'findById',
        'commit',
        'invalidate',
        'recordArchived',
      ]);
      expect(findById).toHaveBeenCalledWith('12');
      expect(recordArchived).toHaveBeenCalledWith({
        subjectId: '12',
        version: 4,
        occurredAt: '2026-01-05T08:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: 'active' },
      });
    });

    it('answers not-found for an unknown product and writes nothing', async () => {
      lockById.mockResolvedValue(null);

      const view = await useCase.execute({ productId: '99', expectedVersion: undefined });

      expect(view).toEqual({ outcome: 'not-found', currentVersion: undefined });
      expect(update).not.toHaveBeenCalled();
      expect(afterCommit).not.toHaveBeenCalled();
    });

    it('answers version-mismatch with the current version for a stale expected version', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 2 });

      expect(view).toEqual({ outcome: 'version-mismatch', currentVersion: 3 });
      expect(update).not.toHaveBeenCalled();
      expect(afterCommit).not.toHaveBeenCalled();
    });

    it('answers already-archived for an archived product and announces nothing', async () => {
      lockById.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        status: ProductStatusEnum.ARCHIVED,
        version: 5,
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      const view = await useCase.execute({ productId: '12', expectedVersion: undefined });

      expect(view).toEqual({ outcome: 'already-archived', currentVersion: 5 });
      expect(update).not.toHaveBeenCalled();
      expect(afterCommit).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
