import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductGetOneModel } from '../../../domain';
import { ProductAccessService } from '../product-access.service';
import type { IProductAccessRepositoryPort } from '../../../outbound';

describe('ProductAccessService', () => {
  let repository: jest.Mocked<IProductAccessRepositoryPort>;
  let service: ProductAccessService;

  beforeEach(() => {
    repository = { findOne: jest.fn() };
    repository.findOne.mockResolvedValue({
      id: '12',
      sku: 'SKU-0001',
      name: 'Lamp',
      status: ProductStatusEnum.ACTIVE,
      version: 3,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    service = new ProductAccessService(repository);
  });

  describe('load', () => {
    it('answers the product of the id', async () => {
      const product = await service.load({ productId: '12' }, ProductGetOneModel.reconstitute);

      expect(product.id).toBe('12');
      expect(repository.findOne).toHaveBeenCalledWith('12');
    });

    it('refuses a missing product with PRODUCT_NOT_FOUND', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.load({ productId: '12' }, ProductGetOneModel.reconstitute),
      ).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product 12 was not found',
      });
    });
  });

  describe('assertExists', () => {
    it('passes for a stored product', async () => {
      await expect(service.assertExists({ productId: '12' })).resolves.toBeUndefined();
      expect(repository.findOne).toHaveBeenCalledWith('12');
    });

    it('refuses a missing product with PRODUCT_NOT_FOUND', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.assertExists({ productId: '12' })).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
      });
    });
  });
});
