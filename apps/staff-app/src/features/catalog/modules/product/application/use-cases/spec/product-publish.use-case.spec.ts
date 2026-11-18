import type { PinoLogger } from 'nestjs-pino';

import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductPublishModel } from '../../../domain';
import { ProductPublishUseCase } from '../product-publish.use-case';
import type { IProductLedgerPort } from '../../../outbound';
import type { ProductWriteService } from '../../services/product-write.service';

describe('ProductPublishUseCase', () => {
  let write: jest.Mock;
  let recordPublished: jest.Mock;
  let invalidate: jest.Mock;
  let logger: PinoLoggerMock;
  let useCase: ProductPublishUseCase;

  beforeEach(() => {
    write = jest.fn().mockResolvedValue({
      product: ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
      answer: {
        subjectId: '12',
        version: 2,
        payload: { sku: 'SKU-0001', previousStatus: ProductStatusEnum.DRAFT },
      },
    });
    recordPublished = jest.fn().mockResolvedValue(undefined);
    invalidate = jest.fn().mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new ProductPublishUseCase(
      { write } as unknown as ProductWriteService,
      { invalidate },
      { recordPublished } as unknown as IProductLedgerPort,
      logger as unknown as PinoLogger,
    );
  });

  describe('execute', () => {
    it('publishes, records the publication in the ledger and answers the stored product', async () => {
      const view = await useCase.execute({ productId: '12', expectedVersion: 1 });

      expect(write).toHaveBeenCalledWith(
        { productId: '12', expectedVersion: 1 },
        ProductPublishModel.reconstitute,
        expect.any(Function),
      );
      expect(recordPublished).toHaveBeenCalledWith({
        subjectId: '12',
        version: 2,
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
      const { product } = (await write()) as { product: ProductPublishModel };

      write.mockResolvedValue({ product, answer: undefined });

      await useCase.execute({ productId: '12', expectedVersion: 2 });

      expect(recordPublished).not.toHaveBeenCalled();
    });

    it('invalidates the customer catalog after the write and before the ledger', async () => {
      await useCase.execute({ productId: '12', expectedVersion: undefined });

      expect(invalidate).toHaveBeenCalledTimes(1);
      expect(write.mock.invocationCallOrder[0]).toBeLessThan(
        invalidate.mock.invocationCallOrder[0],
      );
      expect(invalidate.mock.invocationCallOrder[0]).toBeLessThan(
        recordPublished.mock.invocationCallOrder[0],
      );
    });

    it('invalidates nothing when the write fails', async () => {
      write.mockRejectedValue(new Error('PRODUCT_ALREADY_ARCHIVED'));

      await expect(
        useCase.execute({ productId: '12', expectedVersion: undefined }),
      ).rejects.toThrow('PRODUCT_ALREADY_ARCHIVED');
      expect(invalidate).not.toHaveBeenCalled();
      expect(recordPublished).not.toHaveBeenCalled();
    });

    it('stops at a failed invalidation before the ledger', async () => {
      invalidate.mockRejectedValue(new Error('redis is down'));

      await expect(
        useCase.execute({ productId: '12', expectedVersion: undefined }),
      ).rejects.toThrow('redis is down');
      expect(recordPublished).not.toHaveBeenCalled();
    });

    it('hands the write service a change that publishes the product and answers its ledger payload', async () => {
      const product = ProductPublishModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.DRAFT,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      await useCase.execute({ productId: '12', expectedVersion: 1 });

      const [, , mutate] = write.mock.calls[0] as [
        unknown,
        unknown,
        (product: ProductPublishModel) => unknown,
      ];

      const answer = mutate(product);

      expect(product.toSnapshot().status).toBe('active');
      expect(answer).toEqual({
        subjectId: '12',
        version: 2,
        payload: { sku: 'SKU-0001', previousStatus: 'draft' },
      });
    });
  });
});
