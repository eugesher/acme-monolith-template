import {
  ProductTagReplaceOutcomeEnum,
  type IProductReplaceTagsRepositoryPort,
  type IProductTagPort,
  type IProductTransactionPort,
} from '../../../outbound';
import { ProductReplaceTagsCase } from '../product-replace-tags.case';

describe('ProductReplaceTagsCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IProductReplaceTagsRepositoryPort>;
  let tag: jest.Mocked<IProductTagPort>;
  let transaction: jest.Mocked<IProductTransactionPort>;
  let replaceTagsCase: ProductReplaceTagsCase;

  beforeEach(() => {
    calls = [];
    repository = { lockOne: jest.fn() };
    repository.lockOne.mockImplementation(() => {
      calls.push('lockOne');

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
    replaceTagsCase = new ProductReplaceTagsCase(repository, tag, transaction);
  });

  describe('execute', () => {
    it('locks the product, then replaces its tags in the same transaction', async () => {
      const view = await replaceTagsCase.execute({ productId: '100', tagIds: ['300'] });

      expect(view).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
      expect(repository.lockOne).toHaveBeenCalledWith('100');
      expect(tag.replace).toHaveBeenCalledWith({ productId: '100', tagIds: ['300'] });
      expect(calls).toEqual(['begin', 'lockOne', 'replace', 'commit']);
    });

    it('refuses an unknown product with PRODUCT_NOT_FOUND and replaces nothing', async () => {
      repository.lockOne.mockResolvedValue(null);

      await expect(
        replaceTagsCase.execute({ productId: '999', tagIds: ['300'] }),
      ).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product 999 was not found',
      });
      expect(tag.replace).not.toHaveBeenCalled();
    });

    it('refuses missing tags with PRODUCT_TAG_NOT_FOUND and their ids, so the transaction rolls back', async () => {
      tag.replace.mockResolvedValue({
        outcome: ProductTagReplaceOutcomeEnum.TAG_NOT_FOUND,
        tags: [],
        missingTagIds: ['999'],
      });

      const replacing = replaceTagsCase.execute({ productId: '100', tagIds: ['300', '999'] });

      await expect(replacing).rejects.toMatchObject({
        code: 'PRODUCT_TAG_NOT_FOUND',
        message: 'Some of the tags do not exist',
        details: { missingTagIds: ['999'] },
      });
      expect(calls).not.toContain('commit');
    });
  });
});
