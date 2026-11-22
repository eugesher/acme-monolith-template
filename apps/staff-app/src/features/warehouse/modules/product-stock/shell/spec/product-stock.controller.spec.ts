import { ProductStockController } from '../product-stock.controller';
import type { ProductStockAddUseCase } from '../../application';

describe('ProductStockController', () => {
  let add: jest.Mocked<Pick<ProductStockAddUseCase, 'execute'>>;
  let controller: ProductStockController;

  beforeEach(() => {
    add = { execute: jest.fn() };

    controller = new ProductStockController(add as unknown as ProductStockAddUseCase);
  });

  describe('handleAdd', () => {
    it('adds the quantity of the body to the stock of the product of the path for the caller under the idempotency key', async () => {
      add.execute.mockResolvedValue({ productId: '12', quantity: 15 });

      const response = await controller.handleAdd(
        { id: 'staff-1', email: 'editor@example.com' },
        { productId: '12' },
        { quantity: 5 },
        'key-1',
      );

      expect(response).toEqual({ productId: '12', quantity: 15 });
      expect(add.execute).toHaveBeenCalledWith({
        productId: '12',
        quantity: 5,
        staffUserId: 'staff-1',
        idempotencyKey: 'key-1',
      });
    });
  });
});
