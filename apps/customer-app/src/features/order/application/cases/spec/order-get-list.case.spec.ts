import { OrderGetListCase } from '../order-get-list.case';
import type { IOrderGetListRepositoryPort } from '../../../outbound';

describe('OrderGetListCase', () => {
  let repository: jest.Mocked<IOrderGetListRepositoryPort>;
  let getListCase: OrderGetListCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
      [{ id: '600', createdAt: new Date('2026-01-03T00:00:00.000Z') }],
      1,
    ]);
    getListCase = new OrderGetListCase(repository);
  });

  describe('execute', () => {
    it('lists the orders of the customer in the default window', async () => {
      const page = await getListCase.execute({
        customerId: 'customer-1',
        page: undefined,
        limit: undefined,
      });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        customerId: 'customer-1',
      });
      expect(page).toEqual({
        page: 1,
        limit: 20,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [{ id: '600', createdAt: '2026-01-03T00:00:00.000Z' }],
      });
    });

    it('clamps the page limit to 100', async () => {
      await getListCase.execute({ customerId: 'customer-1', page: 3, limit: 500 });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 100,
        offset: 200,
        customerId: 'customer-1',
      });
    });
  });
});
