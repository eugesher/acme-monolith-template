import { ProductCoreArchiveOutcomeEnum, type IProductCorePort } from '@acme-core/contracts/product';

import { ProductStockPostSubtractArchiveCoreAdapter } from '../product-stock-post-subtract-archive-core.adapter';

describe('ProductStockPostSubtractArchiveCoreAdapter', () => {
  let product: jest.Mocked<IProductCorePort>;
  let adapter: ProductStockPostSubtractArchiveCoreAdapter;

  beforeEach(() => {
    product = { handleArchive: jest.fn() };
    adapter = new ProductStockPostSubtractArchiveCoreAdapter(product);
  });

  describe('archive', () => {
    it('archives the product through the core module without an expected version', async () => {
      product.handleArchive.mockResolvedValue({
        outcome: ProductCoreArchiveOutcomeEnum.ARCHIVED,
        currentVersion: 2,
      });

      const view = await adapter.archive({ productId: '106' });

      expect(product.handleArchive).toHaveBeenCalledWith({
        productId: '106',
        expectedVersion: undefined,
      });
      expect(view).toEqual({ archived: true });
    });

    it.each([
      ProductCoreArchiveOutcomeEnum.ALREADY_ARCHIVED,
      ProductCoreArchiveOutcomeEnum.NOT_FOUND,
      ProductCoreArchiveOutcomeEnum.VERSION_MISMATCH,
    ])('answers not archived for %s', async (outcome) => {
      product.handleArchive.mockResolvedValue({ outcome, currentVersion: 2 });

      const view = await adapter.archive({ productId: '106' });

      expect(view).toEqual({ archived: false });
    });
  });
});
