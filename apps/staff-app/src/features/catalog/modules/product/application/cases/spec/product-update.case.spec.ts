import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductUpdateModel } from '../../../domain';
import { ProductUpdateCase } from '../product-update.case';
import type { IProductCatalogCachePort } from '../../../outbound';
import type { ProductWriteService } from '../../services/product-write.service';

describe('ProductUpdateCase', () => {
  let writeService: jest.Mocked<Pick<ProductWriteService, 'write'>>;
  let catalogCache: jest.Mocked<IProductCatalogCachePort>;
  let logger: PinoLoggerMock;
  let updateCase: ProductUpdateCase;

  beforeEach(() => {
    writeService = { write: jest.fn() };
    writeService.write.mockResolvedValue({
      product: ProductUpdateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Desk lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 4,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
      answer: undefined,
    });
    catalogCache = { invalidate: jest.fn() };
    catalogCache.invalidate.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    updateCase = new ProductUpdateCase(
      writeService as unknown as ProductWriteService,
      catalogCache,
      logger,
    );
  });

  describe('execute', () => {
    it('updates through the write service and answers the stored product', async () => {
      const view = await updateCase.execute({
        productId: '12',
        name: 'Desk lamp',
        expectedVersion: 3,
      });

      expect(writeService.write).toHaveBeenCalledWith(
        { productId: '12', expectedVersion: 3 },
        ProductUpdateModel.reconstitute,
        expect.any(Function),
      );
      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Desk lamp',
        status: 'active',
        version: 4,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith({ id: '12', version: 4 }, 'Product updated');
    });

    it('invalidates the customer catalog after the write', async () => {
      await updateCase.execute({ productId: '12', name: 'Desk lamp', expectedVersion: 3 });

      expect(catalogCache.invalidate).toHaveBeenCalledTimes(1);
      expect(writeService.write.mock.invocationCallOrder[0]).toBeLessThan(
        catalogCache.invalidate.mock.invocationCallOrder[0],
      );
    });

    it('invalidates nothing when the write fails', async () => {
      writeService.write.mockRejectedValue(new Error('PRODUCT_NOT_FOUND'));

      await expect(
        updateCase.execute({ productId: '12', name: 'Desk lamp', expectedVersion: 3 }),
      ).rejects.toThrow('PRODUCT_NOT_FOUND');
      expect(catalogCache.invalidate).not.toHaveBeenCalled();
    });

    it('lets a failed invalidation reject without logging the update', async () => {
      catalogCache.invalidate.mockRejectedValue(new Error('redis is down'));

      await expect(
        updateCase.execute({ productId: '12', name: 'Desk lamp', expectedVersion: 3 }),
      ).rejects.toThrow('redis is down');
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('hands the write service a change that updates the name of the product', async () => {
      const product = ProductUpdateModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      await updateCase.execute({
        productId: '12',
        name: 'Desk lamp',
        expectedVersion: undefined,
      });

      const [, , mutate] = writeService.write.mock.calls[0] as [
        unknown,
        unknown,
        (product: ProductUpdateModel) => void,
      ];

      mutate(product);

      expect(product.toSnapshot().name).toBe('Desk lamp');
    });
  });
});
