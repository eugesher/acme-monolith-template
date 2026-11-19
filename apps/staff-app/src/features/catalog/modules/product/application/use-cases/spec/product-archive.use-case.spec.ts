import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductGetOneModel } from '../../../domain';
import { ProductStatusArchiveOutcomeEnum, type IProductStatusPort } from '../../../outbound';
import { ProductArchiveUseCase } from '../product-archive.use-case';
import type { ProductAccessService } from '../../services/product-access.service';

describe('ProductArchiveUseCase', () => {
  let accessService: jest.Mocked<Pick<ProductAccessService, 'load'>>;
  let status: jest.Mocked<IProductStatusPort>;
  let useCase: ProductArchiveUseCase;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load.mockResolvedValue(
      ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ARCHIVED,
        version: 4,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
    );
    status = { archive: jest.fn() };
    status.archive.mockResolvedValue({
      outcome: ProductStatusArchiveOutcomeEnum.ARCHIVED,
      currentVersion: 4,
    });
    useCase = new ProductArchiveUseCase(accessService as unknown as ProductAccessService, status);
  });

  describe('execute', () => {
    it('archives through the status port and answers the product as stored', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 3 });

      expect(status.archive).toHaveBeenCalledWith({ productId: '12', expectedVersion: 3 });
      expect(accessService.load).toHaveBeenCalledWith(
        { productId: '12' },
        ProductGetOneModel.reconstitute,
      );
      expect(status.archive.mock.invocationCallOrder[0]).toBeLessThan(
        accessService.load.mock.invocationCallOrder[0],
      );
      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'archived',
        version: 4,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      });
    });

    it('refuses an unknown product with PRODUCT_NOT_FOUND', async () => {
      status.archive.mockResolvedValue({
        outcome: ProductStatusArchiveOutcomeEnum.NOT_FOUND,
        currentVersion: undefined,
      });

      await expect(
        useCase.execute({ productId: '99', expectedVersion: undefined }),
      ).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product 99 was not found',
      });
      expect(accessService.load).not.toHaveBeenCalled();
    });

    it('refuses a stale If-Match with PRODUCT_VERSION_MISMATCH and the current version', async () => {
      status.archive.mockResolvedValue({
        outcome: ProductStatusArchiveOutcomeEnum.VERSION_MISMATCH,
        currentVersion: 3,
      });

      await expect(useCase.execute({ productId: '12', expectedVersion: 2 })).rejects.toMatchObject({
        code: 'VERSION_MISMATCH',
        message: 'Product 12: If-Match version 2 does not match the current version 3',
        details: { currentVersion: 3 },
      });
    });

    it('refuses an archived product with PRODUCT_ALREADY_ARCHIVED', async () => {
      status.archive.mockResolvedValue({
        outcome: ProductStatusArchiveOutcomeEnum.ALREADY_ARCHIVED,
        currentVersion: 5,
      });

      await expect(
        useCase.execute({ productId: '12', expectedVersion: undefined }),
      ).rejects.toMatchObject({
        code: 'PRODUCT_ALREADY_ARCHIVED',
        message: 'Product 12 is already archived',
      });
    });
  });
});
