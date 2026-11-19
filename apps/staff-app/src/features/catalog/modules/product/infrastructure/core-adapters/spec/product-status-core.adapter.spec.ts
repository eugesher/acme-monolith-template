import { ProductCoreArchiveOutcomeEnum, type IProductCorePort } from '@acme-core/contracts/product';

import { ProductStatusCoreAdapter } from '../product-status-core.adapter';

describe('ProductStatusCoreAdapter', () => {
  let product: jest.Mocked<IProductCorePort>;
  let adapter: ProductStatusCoreAdapter;

  beforeEach(() => {
    product = { handleArchive: jest.fn() };
    adapter = new ProductStatusCoreAdapter(product);
  });

  describe('archive', () => {
    it('archives the product of the command through the core module', async () => {
      product.handleArchive.mockResolvedValue({
        outcome: ProductCoreArchiveOutcomeEnum.ARCHIVED,
        currentVersion: 4,
      });

      const view = await adapter.archive({ productId: '12', expectedVersion: 3 });

      expect(product.handleArchive).toHaveBeenCalledWith({ productId: '12', expectedVersion: 3 });
      expect(view).toEqual({ outcome: 'archived', currentVersion: 4 });
    });

    it.each([
      [ProductCoreArchiveOutcomeEnum.ALREADY_ARCHIVED, 'already-archived'],
      [ProductCoreArchiveOutcomeEnum.NOT_FOUND, 'not-found'],
      [ProductCoreArchiveOutcomeEnum.VERSION_MISMATCH, 'version-mismatch'],
    ])('turns the core outcome %s into %s', async (outcome, expected) => {
      product.handleArchive.mockResolvedValue({ outcome, currentVersion: 5 });

      const view = await adapter.archive({ productId: '12', expectedVersion: undefined });

      expect(view).toEqual({ outcome: expected, currentVersion: 5 });
    });
  });
});
