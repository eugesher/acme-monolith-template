import { ProductGetTagsUseCase } from '../product-get-tags.use-case';
import type { ProductAccessService } from '../../services/product-access.service';

describe('ProductGetTagsUseCase', () => {
  let assertExists: jest.Mock;
  let find: jest.Mock;
  let useCase: ProductGetTagsUseCase;

  beforeEach(() => {
    assertExists = jest.fn().mockResolvedValue(undefined);
    find = jest.fn().mockResolvedValue([{ id: '300', name: 'fragile' }]);
    useCase = new ProductGetTagsUseCase({ assertExists } as unknown as ProductAccessService, {
      find,
      replace: jest.fn(),
      findProductIds: jest.fn(),
    });
  });

  describe('execute', () => {
    it('answers the tags of an existing product', async () => {
      const view = await useCase.execute({ productId: '100' });

      expect(assertExists).toHaveBeenCalledWith({ productId: '100' });
      expect(find).toHaveBeenCalledWith({ productId: '100' });
      expect(view).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
    });

    it('reads no tags when the product does not exist', async () => {
      assertExists.mockRejectedValue(new Error('not found'));

      await expect(useCase.execute({ productId: '999' })).rejects.toThrow('not found');
      expect(find).not.toHaveBeenCalled();
    });
  });
});
