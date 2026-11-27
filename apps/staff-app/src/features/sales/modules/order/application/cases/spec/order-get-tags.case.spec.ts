import { OrderGetTagsCase } from '../order-get-tags.case';
import type { IOrderGetTagsRepositoryPort, IOrderTagPort } from '../../../outbound';

describe('OrderGetTagsCase', () => {
  let repository: jest.Mocked<IOrderGetTagsRepositoryPort>;
  let tag: jest.Mocked<IOrderTagPort>;
  let getTagsCase: OrderGetTagsCase;

  beforeEach(() => {
    repository = { findExisting: jest.fn() };
    repository.findExisting.mockResolvedValue({ id: '600' });
    tag = { find: jest.fn(), replace: jest.fn(), findOrderIds: jest.fn() };
    tag.find.mockResolvedValue([{ id: '302', name: 'vip' }]);
    getTagsCase = new OrderGetTagsCase(repository, tag);
  });

  describe('execute', () => {
    it('answers the tags of an existing order', async () => {
      const view = await getTagsCase.execute({ orderId: '600' });

      expect(repository.findExisting).toHaveBeenCalledWith('600');
      expect(tag.find).toHaveBeenCalledWith({ orderId: '600' });
      expect(view).toEqual({ tags: [{ id: '302', name: 'vip' }] });
    });

    it('refuses an unknown order with ORDER_NOT_FOUND and reads no tags', async () => {
      repository.findExisting.mockResolvedValue(null);

      await expect(getTagsCase.execute({ orderId: '999' })).rejects.toMatchObject({
        code: 'ORDER_NOT_FOUND',
        message: 'Order 999 was not found',
      });
      expect(tag.find).not.toHaveBeenCalled();
    });
  });
});
