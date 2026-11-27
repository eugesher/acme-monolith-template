import { OrderGetOneCase } from '../order-get-one.case';
import type { IOrderGetOneRepositoryPort } from '../../../outbound';

describe('OrderGetOneCase', () => {
  let repository: jest.Mocked<IOrderGetOneRepositoryPort>;
  let getOneCase: OrderGetOneCase;

  beforeEach(() => {
    repository = { findOne: jest.fn() };
    repository.findOne.mockResolvedValue({
      id: '600',
      customerId: 'customer-1',
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
      orderProducts: [{ id: '600', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
    });
    getOneCase = new OrderGetOneCase(repository);
  });

  describe('execute', () => {
    it('returns the order of any customer with its products', async () => {
      const view = await getOneCase.execute({ orderId: '600' });

      expect(repository.findOne).toHaveBeenCalledWith('600');
      expect(view).toEqual({
        id: '600',
        customerId: 'customer-1',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [{ id: '600', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });
    });

    it('refuses a missing order with ORDER_NOT_FOUND', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(getOneCase.execute({ orderId: '999' })).rejects.toMatchObject({
        code: 'ORDER_NOT_FOUND',
        message: 'Order 999 was not found',
      });
    });
  });
});
