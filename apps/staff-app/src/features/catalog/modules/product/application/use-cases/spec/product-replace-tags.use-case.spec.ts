import { ProductNotFoundException, ProductTagNotFoundException } from '../../../domain';
import {
  ProductTagReplaceOutcomeEnum,
  type IProductReplaceTagsRepositoryPort,
  type IProductTagPort,
  type IProductTransactionPort,
} from '../../../outbound';
import { ProductReplaceTagsUseCase } from '../product-replace-tags.use-case';

describe('ProductReplaceTagsUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IProductReplaceTagsRepositoryPort>;
  let tag: jest.Mocked<IProductTagPort>;
  let transaction: jest.Mocked<IProductTransactionPort>;
  let useCase: ProductReplaceTagsUseCase;

  beforeEach(() => {
    calls = [];
    repository = { lockById: jest.fn() };
    repository.lockById.mockImplementation(() => {
      calls.push('lockById');

      return Promise.resolve({ id: '100' });
    });
    tag = { find: jest.fn(), replace: jest.fn(), findProductIds: jest.fn() };
    tag.replace.mockImplementation(() => {
      calls.push('replace');

      return Promise.resolve({
        outcome: ProductTagReplaceOutcomeEnum.REPLACED,
        tags: [{ id: '300', name: 'fragile' }],
        missingTagIds: [],
      });
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    useCase = new ProductReplaceTagsUseCase(repository, tag, transaction);
  });

  describe('execute', () => {
    it('locks the product, then replaces its tags in the same transaction', async () => {
      const view = await useCase.execute({ productId: '100', tagIds: ['300'] });

      expect(view).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
      expect(repository.lockById).toHaveBeenCalledWith('100');
      expect(tag.replace).toHaveBeenCalledWith({ productId: '100', tagIds: ['300'] });
      expect(calls).toEqual(['begin', 'lockById', 'replace', 'commit']);
    });

    it('throws ProductNotFoundException and replaces nothing for an unknown product', async () => {
      repository.lockById.mockResolvedValue(null);

      await expect(useCase.execute({ productId: '999', tagIds: ['300'] })).rejects.toThrow(
        ProductNotFoundException,
      );
      expect(tag.replace).not.toHaveBeenCalled();
    });

    it('throws ProductTagNotFoundException with the missing tags, so the transaction rolls back', async () => {
      tag.replace.mockResolvedValue({
        outcome: ProductTagReplaceOutcomeEnum.TAG_NOT_FOUND,
        tags: [],
        missingTagIds: ['999'],
      });

      const error: unknown = await useCase
        .execute({ productId: '100', tagIds: ['300', '999'] })
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(ProductTagNotFoundException);
      expect(error).toMatchObject({ details: { missingTagIds: ['999'] } });
      expect(calls).not.toContain('commit');
    });
  });
});
