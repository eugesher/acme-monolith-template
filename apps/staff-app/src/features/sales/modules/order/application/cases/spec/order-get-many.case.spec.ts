import { OrderGetManyCase } from '../order-get-many.case';
import type { IOrderGetManyRepositoryPort, IOrderTagPort } from '../../../outbound';

describe('OrderGetManyCase', () => {
  let repository: jest.Mocked<IOrderGetManyRepositoryPort>;
  let tag: jest.Mocked<IOrderTagPort>;
  let getManyCase: OrderGetManyCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
      [{ id: '600', customerId: 'customer-1', createdAt: new Date('2026-01-03T00:00:00.000Z') }],
      1,
    ]);
    tag = { find: jest.fn(), replace: jest.fn(), findOrderIds: jest.fn() };
    tag.findOrderIds.mockResolvedValue(['600']);
    getManyCase = new OrderGetManyCase(repository, tag);
  });

  describe('execute', () => {
    it('lists the orders of all customers in the default window', async () => {
      const page = await getManyCase.execute({
        page: undefined,
        limit: undefined,
        tagId: undefined,
      });

      expect(repository.list).toHaveBeenCalledWith({ limit: 20, offset: 0, orderIds: undefined });
      expect(tag.findOrderIds).not.toHaveBeenCalled();
      expect(page).toEqual({
        page: 1,
        limit: 20,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [{ id: '600', customerId: 'customer-1', createdAt: '2026-01-03T00:00:00.000Z' }],
      });
    });

    it('clamps the page limit to 100', async () => {
      await getManyCase.execute({ page: 3, limit: 500, tagId: undefined });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 100,
        offset: 200,
        orderIds: undefined,
      });
    });

    it('lists only the orders that carry the tag', async () => {
      await getManyCase.execute({ page: undefined, limit: undefined, tagId: '302' });

      expect(tag.findOrderIds).toHaveBeenCalledWith({ tagId: '302' });
      expect(repository.list).toHaveBeenCalledWith({ limit: 20, offset: 0, orderIds: ['600'] });
    });

    it('answers an empty page without a query when no order carries the tag', async () => {
      tag.findOrderIds.mockResolvedValue([]);

      const page = await getManyCase.execute({ page: undefined, limit: undefined, tagId: '302' });

      expect(repository.list).not.toHaveBeenCalled();
      expect(page).toEqual({ page: 1, limit: 20, count: 0, pageCount: 0, total: 0, data: [] });
    });
  });
});
