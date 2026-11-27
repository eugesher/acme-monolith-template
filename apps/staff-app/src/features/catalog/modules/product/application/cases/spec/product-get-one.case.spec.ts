import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductGetOneModel } from '../../../domain';
import { ProductGetOneCase } from '../product-get-one.case';
import type { ProductAccessService } from '../../services/product-access.service';

describe('ProductGetOneCase', () => {
  let accessService: jest.Mocked<Pick<ProductAccessService, 'load'>>;
  let getOneCase: ProductGetOneCase;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load.mockResolvedValue(
      ProductGetOneModel.reconstitute({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      }),
    );
    getOneCase = new ProductGetOneCase(accessService as unknown as ProductAccessService);
  });

  describe('execute', () => {
    it('answers the view of the product the caller owns', async () => {
      const view = await getOneCase.execute({ productId: '12' });

      expect(accessService.load).toHaveBeenCalledWith(
        { productId: '12' },
        ProductGetOneModel.reconstitute,
      );
      expect(view).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'active',
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });
});
