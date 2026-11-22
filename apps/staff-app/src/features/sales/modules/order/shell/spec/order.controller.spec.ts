import { OrderController } from '../order.controller';
import type {
  OrderGetManyUseCase,
  OrderGetOneUseCase,
  OrderGetTagsUseCase,
  OrderReplaceTagsUseCase,
} from '../../application';

describe('OrderController', () => {
  let getMany: jest.Mocked<Pick<OrderGetManyUseCase, 'execute'>>;
  let getOne: jest.Mocked<Pick<OrderGetOneUseCase, 'execute'>>;
  let getTags: jest.Mocked<Pick<OrderGetTagsUseCase, 'execute'>>;
  let replaceTags: jest.Mocked<Pick<OrderReplaceTagsUseCase, 'execute'>>;
  let controller: OrderController;

  beforeEach(() => {
    getMany = { execute: jest.fn() };
    getOne = { execute: jest.fn() };
    getTags = { execute: jest.fn() };
    replaceTags = { execute: jest.fn() };

    controller = new OrderController(
      getMany as unknown as OrderGetManyUseCase,
      getOne as unknown as OrderGetOneUseCase,
      getTags as unknown as OrderGetTagsUseCase,
      replaceTags as unknown as OrderReplaceTagsUseCase,
    );
  });

  describe('handleGetMany', () => {
    it('lists the orders for the page window and the tag', async () => {
      getMany.execute.mockResolvedValue({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetMany({ page: 2, limit: 5, tagId: '302' });

      expect(response).toEqual({ page: 2, limit: 5, count: 0, pageCount: 0, total: 0, data: [] });
      expect(getMany.execute).toHaveBeenCalledWith({ page: 2, limit: 5, tagId: '302' });
    });
  });

  describe('handleGetOne', () => {
    it('reads the order of the path', async () => {
      getOne.execute.mockResolvedValue({
        id: '600',
        customerId: 'customer-1',
        createdAt: '2026-01-05T08:00:00.000Z',
        orderProducts: [],
      });

      const response = await controller.handleGetOne({ orderId: '600' });

      expect(response).toEqual({
        id: '600',
        customerId: 'customer-1',
        createdAt: '2026-01-05T08:00:00.000Z',
        orderProducts: [],
      });
      expect(getOne.execute).toHaveBeenCalledWith({ orderId: '600' });
    });
  });

  describe('handleGetTags', () => {
    it('reads the tags of the order of the path', async () => {
      getTags.execute.mockResolvedValue({ tags: [{ id: '302', name: 'vip' }] });

      const response = await controller.handleGetTags({ orderId: '600' });

      expect(response).toEqual({ tags: [{ id: '302', name: 'vip' }] });
      expect(getTags.execute).toHaveBeenCalledWith({ orderId: '600' });
    });
  });

  describe('handleReplaceTags', () => {
    it('replaces the tags of the order of the path with the tags of the body', async () => {
      replaceTags.execute.mockResolvedValue({ tags: [{ id: '302', name: 'vip' }] });

      const response = await controller.handleReplaceTags({ orderId: '600' }, { tagIds: ['302'] });

      expect(response).toEqual({ tags: [{ id: '302', name: 'vip' }] });
      expect(replaceTags.execute).toHaveBeenCalledWith({ orderId: '600', tagIds: ['302'] });
    });
  });
});
