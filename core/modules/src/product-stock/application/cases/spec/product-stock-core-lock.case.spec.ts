import { ProductStockCoreLockCase } from '../product-stock-core-lock.case';
import type { IProductStockCoreLockRepositoryPort } from '../../../outbound';

describe('ProductStockCoreLockCase', () => {
  let repository: jest.Mocked<IProductStockCoreLockRepositoryPort>;
  let lockCase: ProductStockCoreLockCase;

  beforeEach(() => {
    repository = { lockMany: jest.fn(), sumStock: jest.fn() };
    repository.lockMany.mockResolvedValue([{ id: '100' }, { id: '103' }]);
    repository.sumStock.mockResolvedValue([{ productId: '100', quantity: 8 }]);
    lockCase = new ProductStockCoreLockCase(repository);
  });

  describe('execute', () => {
    it('locks the products first and sums the stock of the locked ones', async () => {
      const onHand = await lockCase.execute({ productIds: ['103', '100', '999'] });

      expect(repository.lockMany).toHaveBeenCalledWith(['103', '100', '999']);
      expect(repository.sumStock).toHaveBeenCalledWith(['100', '103']);
      expect(repository.lockMany.mock.invocationCallOrder[0]).toBeLessThan(
        repository.sumStock.mock.invocationCallOrder[0],
      );
      expect(onHand).toEqual([
        { productId: '100', quantity: 8 },
        { productId: '103', quantity: 0 },
      ]);
    });
  });
});
