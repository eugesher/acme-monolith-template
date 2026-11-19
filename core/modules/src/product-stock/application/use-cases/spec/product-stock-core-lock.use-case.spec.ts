import { ProductStockCoreLockUseCase } from '../product-stock-core-lock.use-case';
import type { IProductStockCoreLockRepositoryPort } from '../../../outbound';

describe('ProductStockCoreLockUseCase', () => {
  let repository: jest.Mocked<IProductStockCoreLockRepositoryPort>;
  let useCase: ProductStockCoreLockUseCase;

  beforeEach(() => {
    repository = { lockProducts: jest.fn(), sumStock: jest.fn() };
    repository.lockProducts.mockResolvedValue([{ id: '100' }, { id: '103' }]);
    repository.sumStock.mockResolvedValue([{ productId: '100', quantity: 8 }]);
    useCase = new ProductStockCoreLockUseCase(repository);
  });

  describe('execute', () => {
    it('locks the products first and sums the stock of the locked ones', async () => {
      const onHand = await useCase.execute({ productIds: ['103', '100', '999'] });

      expect(repository.lockProducts).toHaveBeenCalledWith(['103', '100', '999']);
      expect(repository.sumStock).toHaveBeenCalledWith(['100', '103']);
      expect(repository.lockProducts.mock.invocationCallOrder[0]).toBeLessThan(
        repository.sumStock.mock.invocationCallOrder[0],
      );
      expect(onHand).toEqual([
        { productId: '100', quantity: 8 },
        { productId: '103', quantity: 0 },
      ]);
    });
  });
});
