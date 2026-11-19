import { OrderController } from '../order.controller';
import type {
  OrderGetManyUseCase,
  OrderGetOneUseCase,
  OrderPlaceUseCase,
} from '../../../application';

describe('OrderController', () => {
  let place: jest.Mocked<Pick<OrderPlaceUseCase, 'execute'>>;
  let getMany: jest.Mocked<Pick<OrderGetManyUseCase, 'execute'>>;
  let getOne: jest.Mocked<Pick<OrderGetOneUseCase, 'execute'>>;
  let controller: OrderController;

  beforeEach(() => {
    place = { execute: jest.fn() };
    getMany = { execute: jest.fn() };
    getOne = { execute: jest.fn() };

    controller = new OrderController(
      place as unknown as OrderPlaceUseCase,
      getMany as unknown as OrderGetManyUseCase,
      getOne as unknown as OrderGetOneUseCase,
    );
  });

  describe('handlePlace', () => {
    it('places the order of the body for the caller under the idempotency key', async () => {
      place.execute.mockResolvedValue({
        id: '610',
        createdAt: '2026-01-05T08:00:00.000Z',
        orderProducts: [],
      });

      const response = await controller.handlePlace(
        { id: 'customer-1', email: 'ann@example.com' },
        { productIds: ['100', '100'] },
        'key-1',
      );

      expect(response).toEqual({
        id: '610',
        createdAt: '2026-01-05T08:00:00.000Z',
        orderProducts: [],
      });
      expect(place.execute).toHaveBeenCalledWith({
        customerId: 'customer-1',
        productIds: ['100', '100'],
        idempotencyKey: 'key-1',
      });
    });
  });

  describe('handleGetMany', () => {
    it('lists the orders of the caller for the page window', async () => {
      getMany.execute.mockResolvedValue({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetMany(
        { id: 'customer-1', email: 'ann@example.com' },
        { page: 2, limit: 5 },
      );

      expect(response).toEqual({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });
      expect(getMany.execute).toHaveBeenCalledWith({ customerId: 'customer-1', page: 2, limit: 5 });
    });
  });

  describe('handleGetOne', () => {
    it('reads the order of the path for the caller', async () => {
      getOne.execute.mockResolvedValue({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [],
      });

      const response = await controller.handleGetOne(
        { id: 'customer-1', email: 'ann@example.com' },
        { orderId: '600' },
      );

      expect(response).toEqual({
        id: '600',
        createdAt: '2026-01-03T00:00:00.000Z',
        orderProducts: [],
      });
      expect(getOne.execute).toHaveBeenCalledWith({ customerId: 'customer-1', orderId: '600' });
    });
  });
});
