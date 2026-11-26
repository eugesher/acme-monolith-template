import { TagCommonReplaceOutcomeEnum, type ITagCommonPort } from '@acme-staff/contracts/tag';

import { ProductTagCommonAdapter } from '../product-tag-common.adapter';

describe('ProductTagCommonAdapter', () => {
  let tag: jest.Mocked<ITagCommonPort>;
  let adapter: ProductTagCommonAdapter;

  beforeEach(() => {
    tag = { handleFind: jest.fn(), handleReplace: jest.fn(), handleFindSubjectIds: jest.fn() };
    tag.handleFind.mockResolvedValue([{ id: '300', name: 'fragile' }]);
    tag.handleFindSubjectIds.mockResolvedValue(['100']);
    adapter = new ProductTagCommonAdapter(tag);
  });

  describe('find', () => {
    it('reads the tags of the product through the common module', async () => {
      const tags = await adapter.find({ productId: '100' });

      expect(tag.handleFind).toHaveBeenCalledWith({ subjectType: 'product', subjectId: '100' });
      expect(tags).toEqual([{ id: '300', name: 'fragile' }]);
    });
  });

  describe('replace', () => {
    it('replaces the tags of the product through the common module', async () => {
      tag.handleReplace.mockResolvedValue({
        outcome: TagCommonReplaceOutcomeEnum.REPLACED,
        tags: [{ id: '300', name: 'fragile' }],
        missingTagIds: [],
      });

      const view = await adapter.replace({ productId: '100', tagIds: ['300'] });

      expect(tag.handleReplace).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '100',
        tagIds: ['300'],
      });
      expect(view).toEqual({
        outcome: 'replaced',
        tags: [{ id: '300', name: 'fragile' }],
        missingTagIds: [],
      });
    });

    it('turns the common outcome tag-not-found into its own', async () => {
      tag.handleReplace.mockResolvedValue({
        outcome: TagCommonReplaceOutcomeEnum.TAG_NOT_FOUND,
        tags: [],
        missingTagIds: ['999'],
      });

      const view = await adapter.replace({ productId: '100', tagIds: ['999'] });

      expect(view).toEqual({ outcome: 'tag-not-found', tags: [], missingTagIds: ['999'] });
    });
  });

  describe('findProductIds', () => {
    it('reads the ids of the products that carry the tag', async () => {
      const productIds = await adapter.findProductIds({ tagId: '300' });

      expect(tag.handleFindSubjectIds).toHaveBeenCalledWith({
        subjectType: 'product',
        tagId: '300',
      });
      expect(productIds).toEqual(['100']);
    });
  });
});
