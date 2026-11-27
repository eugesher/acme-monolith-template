import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductPublishModel } from '../../../domain';
import { ProductPublishCase } from '../product-publish.case';
import type { IProductCatalogCachePort, IProductLedgerPort } from '../../../outbound';
import type { ProductWriteService } from '../../services/product-write.service';

describe('ProductPublishCase', () => {
  let writeService: jest.Mocked<Pick<ProductWriteService, 'write'>>;
  let catalogCache: jest.Mocked<IProductCatalogCachePort>;
  let ledger: jest.Mocked<IProductLedgerPort>;
  let logger: PinoLoggerMock;
  let publishCase: ProductPublishCase;

  beforeEach(() => {
    writeService = { write: jest.fn() };
    writeService.write.mockResolvedValue({
      product: ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
      answer: ProductStatusEnum.DRAFT,
    });
    ledger = { appendCreated: jest.fn(), appendPublished: jest.fn() };
    ledger.appendPublished.mockResolvedValue(undefined);
    catalogCache = { invalidate: jest.fn() };
    catalogCache.invalidate.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    publishCase = new ProductPublishCase(
      writeService as unknown as ProductWriteService,
      catalogCache,
      ledger,
      logger,
    );
  });

  describe('execute', () => {
    it('publishes, records the publication of the stored product in the ledger and answers it', async () => {
      const view = await publishCase.execute({ productId: '12', expectedVersion: 1 });

      expect(writeService.write).toHaveBeenCalledWith(
        { productId: '12', expectedVersion: 1 },
        ProductPublishModel.reconstitute,
        expect.any(Function),
      );
      expect(ledger.appendPublished).toHaveBeenCalledWith({
        subjectId: '12',
        version: 2,
        occurredAt: '2026-01-03T00:00:00.000Z',
        payload: { sku: 'SKU-0001', previousStatus: 'draft' },
      });
      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'active',
        version: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith({ id: '12' }, 'Product published');
    });

    it('records nothing in the ledger when the product was already active', async () => {
      writeService.write.mockResolvedValue({
        product: ProductPublishModel.reconstitute({
          id: '12',
          sku: 'SKU-0001',
          name: 'Lamp',
          status: ProductStatusEnum.ACTIVE,
          version: 2,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-03T00:00:00.000Z'),
        }),
        answer: undefined,
      });

      await publishCase.execute({ productId: '12', expectedVersion: 2 });

      expect(ledger.appendPublished).not.toHaveBeenCalled();
    });

    it('invalidates the customer catalog after the write and before the ledger', async () => {
      await publishCase.execute({ productId: '12', expectedVersion: undefined });

      expect(catalogCache.invalidate).toHaveBeenCalledTimes(1);
      expect(writeService.write.mock.invocationCallOrder[0]).toBeLessThan(
        catalogCache.invalidate.mock.invocationCallOrder[0],
      );
      expect(catalogCache.invalidate.mock.invocationCallOrder[0]).toBeLessThan(
        ledger.appendPublished.mock.invocationCallOrder[0],
      );
    });

    it('invalidates nothing when the write fails', async () => {
      writeService.write.mockRejectedValue(new Error('PRODUCT_ALREADY_ARCHIVED'));

      await expect(
        publishCase.execute({ productId: '12', expectedVersion: undefined }),
      ).rejects.toThrow('PRODUCT_ALREADY_ARCHIVED');
      expect(catalogCache.invalidate).not.toHaveBeenCalled();
      expect(ledger.appendPublished).not.toHaveBeenCalled();
    });

    it('stops at a failed invalidation before the ledger', async () => {
      catalogCache.invalidate.mockRejectedValue(new Error('redis is down'));

      await expect(
        publishCase.execute({ productId: '12', expectedVersion: undefined }),
      ).rejects.toThrow('redis is down');
      expect(ledger.appendPublished).not.toHaveBeenCalled();
    });

    it('hands the write service a change that publishes the product and answers the status it left', async () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.DRAFT,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      await publishCase.execute({ productId: '12', expectedVersion: 1 });

      const [, , mutate] = writeService.write.mock.calls[0] as [
        unknown,
        unknown,
        (product: ProductPublishModel) => unknown,
      ];

      const answer = mutate(product);

      expect(product.toSnapshot().status).toBe('active');
      expect(answer).toBe('draft');
    });
  });
});
