import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductUpdateModel, type IProductReconstitute } from '../../../domain';
import { ProductWriteService } from '../product-write.service';
import type { IProductWriteRepositoryPort } from '../../../outbound';
import type { ProductAccessService } from '../product-access.service';

describe('ProductWriteService', () => {
  let accessService: jest.Mocked<Pick<ProductAccessService, 'load'>>;
  let repository: jest.Mocked<IProductWriteRepositoryPort>;
  let logger: PinoLoggerMock;
  let service: ProductWriteService;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load.mockImplementation(
      (_command: unknown, reconstitute: (record: IProductReconstitute) => unknown) =>
        Promise.resolve(
          reconstitute({
            id: '12',
            sku: 'SKU-0001',
            name: 'Lamp',
            status: ProductStatusEnum.ACTIVE,
            version: 3,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-01T00:00:00.000Z'),
          }),
        ),
    );
    repository = { findById: jest.fn(), update: jest.fn() };
    repository.findById.mockResolvedValue({
      id: '12',
      sku: 'SKU-0001',
      name: 'Desk lamp',
      status: ProductStatusEnum.ACTIVE,
      version: 4,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
    });
    repository.update.mockResolvedValue(true);
    logger = makePinoLoggerMock();
    service = new ProductWriteService(
      accessService as unknown as ProductAccessService,
      repository,
      5,
      logger,
    );
  });

  describe('write', () => {
    it('saves the change against the version as read and answers the stored product with the answer of the change', async () => {
      const written = await service.write(
        { productId: '12', expectedVersion: undefined },
        ProductUpdateModel.reconstitute,
        (product) => {
          product.update({ name: 'Desk lamp' });

          return product.toLoggerPayload();
        },
      );
      expect(accessService.load).toHaveBeenCalledWith(
        { productId: '12' },
        ProductUpdateModel.reconstitute,
      );
      expect(repository.update).toHaveBeenCalledWith({
        id: '12',
        versionAsRead: 3,
        name: 'Desk lamp',
        status: 'active',
        version: 4,
      });
      expect(repository.findById).toHaveBeenCalledWith('12');
      expect(written.product.toSnapshot().updatedAt).toBe('2026-01-03T00:00:00.000Z');
      expect(written.answer).toEqual({ id: '12', version: 4 });
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('writes nothing when the change leaves the version as read', async () => {
      const written = await service.write(
        { productId: '12', expectedVersion: 3 },
        ProductUpdateModel.reconstitute,
        (product) => product.update({ name: 'Lamp' }),
      );

      expect(repository.update).not.toHaveBeenCalled();
      expect(repository.findById).not.toHaveBeenCalled();
      expect(written.product.version).toBe(3);
      expect(written.answer).toBeUndefined();
    });

    it('retries a lost race with a fresh read and logs the retry', async () => {
      repository.update.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      const written = await service.write(
        { productId: '12', expectedVersion: undefined },
        ProductUpdateModel.reconstitute,
        (product) => product.update({ name: 'Desk lamp' }),
      );

      expect(accessService.load).toHaveBeenCalledTimes(2);
      expect(repository.update).toHaveBeenCalledTimes(2);
      expect(written.product.version).toBe(4);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '12', version: 4, attempt: 1, maxAttempts: 5 },
        'Product write conflict — retrying with a fresh read',
      );
    });

    it('refuses with VERSION_CONFLICT once the budget is spent and logs a warning', async () => {
      repository.update.mockResolvedValue(false);

      await expect(
        service.write(
          { productId: '12', expectedVersion: undefined },
          ProductUpdateModel.reconstitute,
          (product) => product.update({ name: 'Desk lamp' }),
        ),
      ).rejects.toMatchObject({
        code: 'VERSION_CONFLICT',
        message: 'Product 12 write lost the optimistic race after 5 attempts',
        details: { currentVersion: 4 },
      });
      expect(repository.update).toHaveBeenCalledTimes(5);
      expect(logger.warn).toHaveBeenCalledWith(
        { id: '12', attempts: 5, maxAttempts: 5 },
        'Product write conflict exhausted retry budget',
      );
    });

    it('makes one attempt when the caller pinned a version and refuses a lost race with VERSION_MISMATCH', async () => {
      repository.update.mockResolvedValue(false);

      await expect(
        service.write(
          { productId: '12', expectedVersion: 3 },
          ProductUpdateModel.reconstitute,
          (product) => product.update({ name: 'Desk lamp' }),
        ),
      ).rejects.toMatchObject({
        code: 'VERSION_MISMATCH',
        message: 'Product 12: If-Match version 3 does not match the current version 4',
        details: { currentVersion: 4 },
      });
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('refuses a pinned version that is not the current one before changing anything', async () => {
      const mutate = jest.fn();

      await expect(
        service.write(
          { productId: '12', expectedVersion: 2 },
          ProductUpdateModel.reconstitute,
          mutate,
        ),
      ).rejects.toMatchObject({ code: 'VERSION_MISMATCH', details: { currentVersion: 3 } });
      expect(mutate).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('does not retry a domain refusal', async () => {
      await expect(
        service.write(
          { productId: '12', expectedVersion: undefined },
          ProductUpdateModel.reconstitute,
          (product) => product.update({ name: ' ' }),
        ),
      ).rejects.toMatchObject({ code: 'PRODUCT_NAME_INVALID' });
      expect(accessService.load).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['after a lost race', false],
      ['after a saved change', true],
    ])('refuses with PRODUCT_NOT_FOUND when the product vanished %s', async (_case, updated) => {
      repository.update.mockResolvedValue(updated);
      repository.findById.mockResolvedValue(null);

      await expect(
        service.write(
          { productId: '12', expectedVersion: undefined },
          ProductUpdateModel.reconstitute,
          (product) => product.update({ name: 'Desk lamp' }),
        ),
      ).rejects.toMatchObject({ code: 'PRODUCT_NOT_FOUND', message: 'Product 12 was not found' });
    });
  });
});
