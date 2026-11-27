import { OrderGetOneCase } from '../order-get-one.case';
import type { IOrderGetOneRepositoryPort } from '../../../outbound';

describe('OrderGetOneCase', () => {
  let repository: jest.Mocked<IOrderGetOneRepositoryPort>;
  let getOneCase: OrderGetOneCase;

  beforeEach(() => {
    repository = { findOwned: jest.fn() };
    repository.findOwned.mockResolvedValue({
      id: '600',
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
      orderProducts: [{ id: '600', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
    });
    getOneCase = new OrderGetOneCase(repository);
  });

  describe('execute', () => {
    it('returns an own order with its products', async () => {
      const view = await getOneCase.execute({ customerId: 'customer-1', orderId: '600' });

      expect(repository.findOwned).toHaveBeenCalledWith({
        orderId: '600',
        customerId: 'customer-1',
      });
      expect(view).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [{ id: '600', product: { id: '100', sku: 'SKU-0001', name: 'Lamp' } }],
      });
    });

    it('refuses an order not found for the customer with ORDER_NOT_FOUND', async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(
        getOneCase.execute({ customerId: 'customer-1', orderId: '999' }),
      ).rejects.toMatchObject({ code: 'ORDER_NOT_FOUND', message: 'Order 999 was not found' });
    });
  });
});
