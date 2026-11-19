import { ProductNotFoundException, ProductTagNotFoundException } from '../../../domain';
import { ProductReplaceTagsUseCase } from '../product-replace-tags.use-case';

describe('ProductReplaceTagsUseCase', () => {
  let calls: string[];
  let lockById: jest.Mock;
  let replace: jest.Mock;
  let run: jest.Mock;
  let useCase: ProductReplaceTagsUseCase;

  beforeEach(() => {
    calls = [];
    lockById = jest.fn(() => {
      calls.push('lockById');

      return Promise.resolve({ id: '100' });
    });
    replace = jest.fn(() => {
      calls.push('replace');

      return Promise.resolve({
        outcome: 'replaced',
        tags: [{ id: '300', name: 'fragile' }],
        missingTagIds: [],
      });
    });
    run = jest.fn(async (work: () => Promise<unknown>) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    useCase = new ProductReplaceTagsUseCase(
      { lockById },
      { find: jest.fn(), replace, findProductIds: jest.fn() },
      { run },
    );
  });

  describe('execute', () => {
    it('locks the product, then replaces its tags in the same transaction', async () => {
      const view = await useCase.execute({ productId: '100', tagIds: ['300'] });

      expect(view).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
      expect(lockById).toHaveBeenCalledWith('100');
      expect(replace).toHaveBeenCalledWith({ productId: '100', tagIds: ['300'] });
      expect(calls).toEqual(['begin', 'lockById', 'replace', 'commit']);
    });

    it('throws ProductNotFoundException and replaces nothing for an unknown product', async () => {
      lockById.mockResolvedValue(null);

      await expect(useCase.execute({ productId: '999', tagIds: ['300'] })).rejects.toThrow(
        ProductNotFoundException,
      );
      expect(replace).not.toHaveBeenCalled();
    });

    it('throws ProductTagNotFoundException with the missing tags, so the transaction rolls back', async () => {
      replace.mockResolvedValue({ outcome: 'tag-not-found', tags: [], missingTagIds: ['999'] });

      const error: unknown = await useCase
        .execute({ productId: '100', tagIds: ['300', '999'] })
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(ProductTagNotFoundException);
      expect(error).toMatchObject({ details: { missingTagIds: ['999'] } });
      expect(calls).not.toContain('commit');
    });
  });
});
