import { ProductStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  ProductCreateInsertOutcomeEnum,
  type IProductCreateRepositoryPort,
} from '../../../outbound';
import { ProductCreateUseCase } from '../product-create.use-case';
import type { IProductLedgerPort } from '../../../outbound';

describe('ProductCreateUseCase', () => {
  let repository: jest.Mocked<IProductCreateRepositoryPort>;
  let ledger: jest.Mocked<IProductLedgerPort>;
  let logger: PinoLoggerMock;
  let useCase: ProductCreateUseCase;

  beforeEach(() => {
    repository = { insert: jest.fn(), findInserted: jest.fn() };
    repository.insert.mockResolvedValue({
      outcome: ProductCreateInsertOutcomeEnum.INSERTED,
      id: '12',
    });
    repository.findInserted.mockResolvedValue({
      id: '12',
      sku: 'SKU-0001',
      name: 'Lamp',
      status: ProductStatusEnum.DRAFT,
      version: 1,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    ledger = { appendCreated: jest.fn(), appendPublished: jest.fn() };
    ledger.appendCreated.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new ProductCreateUseCase(repository, ledger, logger);
  });

  describe('execute', () => {
    it('creates a draft and answers the stored row', async () => {
      const view = await useCase.execute({ sku: 'SKU-0001', name: 'Lamp' });

      expect(repository.insert).toHaveBeenCalledWith({
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'draft',
        version: 1,
      });
      expect(repository.findInserted).toHaveBeenCalledWith('12');
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

      expect(ledger.appendCreated).toHaveBeenCalledWith({
        subjectId: '12',
        occurredAt: '2026-01-01T00:00:00.000Z',
        payload: { sku: 'SKU-0001', name: 'Lamp' },
      });
      expect(repository.findInserted.mock.invocationCallOrder[0]).toBeLessThan(
        ledger.appendCreated.mock.invocationCallOrder[0],
      );
      expect(logger.info).toHaveBeenCalledWith({ id: '12', sku: 'SKU-0001' }, 'Product created');
    });

    it('refuses a taken sku with PRODUCT_SKU_TAKEN', async () => {
      repository.insert.mockResolvedValue({ outcome: ProductCreateInsertOutcomeEnum.DUPLICATE });

      await expect(useCase.execute({ sku: 'SKU-0001', name: 'Lamp' })).rejects.toMatchObject({
        code: 'PRODUCT_SKU_TAKEN',
        message: 'Product sku SKU-0001 is already registered',
      });
      expect(repository.findInserted).not.toHaveBeenCalled();
      expect(ledger.appendCreated).not.toHaveBeenCalled();
    });
  });
});
