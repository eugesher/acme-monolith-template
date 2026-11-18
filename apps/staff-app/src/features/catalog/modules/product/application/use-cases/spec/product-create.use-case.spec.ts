import type { PinoLogger } from 'nestjs-pino';

import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductCreateInsertOutcomeEnum } from '../../../outbound';
import { ProductCreateUseCase } from '../product-create.use-case';
import type { IProductLedgerPort } from '../../../outbound';

describe('ProductCreateUseCase', () => {
  let insert: jest.Mock;
  let findInserted: jest.Mock;
  let recordCreated: jest.Mock;
  let logger: PinoLoggerMock;
  let useCase: ProductCreateUseCase;

  beforeEach(() => {
    insert = jest
      .fn()
      .mockResolvedValue({ outcome: ProductCreateInsertOutcomeEnum.INSERTED, id: '12' });
    findInserted = jest.fn().mockResolvedValue({
      id: '12',
      sku: 'SKU-0001',
      name: 'Lamp',
      status: ProductStatusEnum.DRAFT,
      version: 1,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    recordCreated = jest.fn().mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new ProductCreateUseCase(
      { insert, findInserted },
      { recordCreated } as unknown as IProductLedgerPort,
      logger as unknown as PinoLogger,
    );
  });

  describe('execute', () => {
    it('creates a draft and answers the stored row', async () => {
      const view = await useCase.execute({ sku: 'SKU-0001', name: 'Lamp' });

      expect(insert).toHaveBeenCalledWith({
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'draft',
        version: 1,
      });
      expect(findInserted).toHaveBeenCalledWith('12');
      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'draft',
        version: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
    });

    it('enqueues the creation record under the stored id and logs it', async () => {
      await useCase.execute({ sku: 'SKU-0001', name: 'Lamp' });

      expect(recordCreated).toHaveBeenCalledWith({
        subjectId: '12',
        occurredAt: '2026-01-01T00:00:00.000Z',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
      });
      expect(findInserted.mock.invocationCallOrder[0]).toBeLessThan(
        recordCreated.mock.invocationCallOrder[0],
      );
      expect(logger.info).toHaveBeenCalledWith({ id: '12', sku: 'SKU-0001' }, 'Product created');
    });

    it('refuses a taken sku with PRODUCT_SKU_TAKEN', async () => {
      insert.mockResolvedValue({ outcome: ProductCreateInsertOutcomeEnum.DUPLICATE });

      await expect(useCase.execute({ sku: 'SKU-0001', name: 'Lamp' })).rejects.toMatchObject({
        code: 'PRODUCT_SKU_TAKEN',
        message: 'Product sku SKU-0001 is already registered',
      });
      expect(findInserted).not.toHaveBeenCalled();
      expect(recordCreated).not.toHaveBeenCalled();
    });
  });
});
