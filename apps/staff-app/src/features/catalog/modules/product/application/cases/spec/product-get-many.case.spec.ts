import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductGetManyCase } from '../product-get-many.case';
import type { IProductGetManyRepositoryPort, IProductTagPort } from '../../../outbound';

describe('ProductGetManyCase', () => {
  let repository: jest.Mocked<IProductGetManyRepositoryPort>;
  let tag: jest.Mocked<IProductTagPort>;
  let getManyCase: ProductGetManyCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
      [
        {
          id: '12',
          sku: 'SKU-0001',
          name: 'Lamp',
          status: ProductStatusEnum.DRAFT,
          version: 1,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
      41,
    ]);
    tag = { find: jest.fn(), replace: jest.fn(), findProductIds: jest.fn() };
    tag.findProductIds.mockResolvedValue(['12', '14']);
    getManyCase = new ProductGetManyCase(repository, tag);
  });

  describe('execute', () => {
    it('answers a page of views', async () => {
      const page = await getManyCase.execute({ page: 2, limit: 20, tagId: undefined });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 20,
        offset: 20,
        productIds: undefined,
      });
      expect(tag.findProductIds).not.toHaveBeenCalled();
      expect(page).toEqual({
        page: 2,
        limit: 20,
        count: 1,
        pageCount: 3,
        total: 41,
        data: [
          {
            id: '12',
            sku: 'SKU-0001',
            name: 'Lamp',
            status: 'draft',
            version: 1,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      });
    });

    it.each([
      ['defaults an absent window', undefined, undefined, { limit: 20, offset: 0 }],
      ['caps the limit at 100', 1, 500, { limit: 100, offset: 0 }],
    ])('%s', async (_case, page, limit, pageWindow) => {
      await getManyCase.execute({ page, limit, tagId: undefined });

      expect(repository.list).toHaveBeenCalledWith({ ...pageWindow, productIds: undefined });
    });

    it('lists only the products that carry the tag', async () => {
      await getManyCase.execute({ page: 1, limit: 20, tagId: '300' });

      expect(tag.findProductIds).toHaveBeenCalledWith({ tagId: '300' });
      expect(repository.list).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        productIds: ['12', '14'],
      });
    });

    it('answers an empty page without a query when no product carries the tag', async () => {
      tag.findProductIds.mockResolvedValue([]);

      const page = await getManyCase.execute({ page: 1, limit: 20, tagId: '300' });

      expect(repository.list).not.toHaveBeenCalled();
      expect(page).toEqual({ page: 1, limit: 20, count: 0, pageCount: 0, total: 0, data: [] });
    });
  });
});
