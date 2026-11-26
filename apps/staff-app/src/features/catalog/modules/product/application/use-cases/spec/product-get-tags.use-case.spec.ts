import { ProductGetTagsUseCase } from '../product-get-tags.use-case';
import type { IProductTagPort } from '../../../outbound';
import type { ProductAccessService } from '../../services/product-access.service';

describe('ProductGetTagsUseCase', () => {
  let accessService: jest.Mocked<Pick<ProductAccessService, 'assertExists'>>;
  let tag: jest.Mocked<IProductTagPort>;
  let useCase: ProductGetTagsUseCase;

  beforeEach(() => {
    accessService = { assertExists: jest.fn() };
    accessService.assertExists.mockResolvedValue(undefined);
    tag = { find: jest.fn(), replace: jest.fn(), findProductIds: jest.fn() };
    tag.find.mockResolvedValue([{ id: '300', name: 'fragile' }]);
    useCase = new ProductGetTagsUseCase(accessService as unknown as ProductAccessService, tag);
  });

  describe('execute', () => {
    it('answers the tags of an existing product', async () => {
      const view = await useCase.execute({ productId: '100' });

      expect(accessService.assertExists).toHaveBeenCalledWith({ productId: '100' });
      expect(tag.find).toHaveBeenCalledWith({ productId: '100' });
      expect(view).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
    });

    it('reads no tags when the product does not exist', async () => {
      accessService.assertExists.mockRejectedValue(new Error('not found'));

      await expect(useCase.execute({ productId: '999' })).rejects.toThrow('not found');
      expect(tag.find).not.toHaveBeenCalled();
    });
  });
});
