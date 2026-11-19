import { OrderNotFoundException } from '../../../domain';
import { OrderGetTagsUseCase } from '../order-get-tags.use-case';
import type { IOrderGetTagsRepositoryPort, IOrderTagPort } from '../../../outbound';

describe('OrderGetTagsUseCase', () => {
  let repository: jest.Mocked<IOrderGetTagsRepositoryPort>;
  let tag: jest.Mocked<IOrderTagPort>;
  let useCase: OrderGetTagsUseCase;

  beforeEach(() => {
    repository = { findExisting: jest.fn() };
    repository.findExisting.mockResolvedValue({ id: '600' });
    tag = { find: jest.fn(), replace: jest.fn(), findOrderIds: jest.fn() };
    tag.find.mockResolvedValue([{ id: '302', name: 'vip' }]);
    useCase = new OrderGetTagsUseCase(repository, tag);
  });

  describe('execute', () => {
    it('answers the tags of an existing order', async () => {
      const view = await useCase.execute({ orderId: '600' });

      expect(repository.findExisting).toHaveBeenCalledWith('600');
      expect(tag.find).toHaveBeenCalledWith({ orderId: '600' });
      expect(view).toEqual({ tags: [{ id: '302', name: 'vip' }] });
    });

    it('throws OrderNotFoundException and reads no tags for an unknown order', async () => {
      repository.findExisting.mockResolvedValue(null);

      await expect(useCase.execute({ orderId: '999' })).rejects.toThrow(OrderNotFoundException);
      expect(tag.find).not.toHaveBeenCalled();
    });
  });
});
