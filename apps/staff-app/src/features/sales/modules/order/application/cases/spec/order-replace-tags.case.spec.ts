import {
  OrderTagReplaceOutcomeEnum,
  type IOrderReplaceTagsRepositoryPort,
  type IOrderTagPort,
  type IOrderTransactionPort,
} from '../../../outbound';
import { OrderReplaceTagsCase } from '../order-replace-tags.case';

describe('OrderReplaceTagsCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IOrderReplaceTagsRepositoryPort>;
  let tag: jest.Mocked<IOrderTagPort>;
  let transaction: jest.Mocked<IOrderTransactionPort>;
  let replaceTagsCase: OrderReplaceTagsCase;

  beforeEach(() => {
    calls = [];
    repository = { lockOne: jest.fn() };
    repository.lockOne.mockImplementation(() => {
      calls.push('lockOne');

      return Promise.resolve({ id: '600' });
    });
    tag = { find: jest.fn(), replace: jest.fn(), findOrderIds: jest.fn() };
    tag.replace.mockImplementation(() => {
      calls.push('replace');

      return Promise.resolve({
        outcome: OrderTagReplaceOutcomeEnum.REPLACED,
        tags: [{ id: '302', name: 'vip' }],
        missingTagIds: [],
      });
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    replaceTagsCase = new OrderReplaceTagsCase(repository, tag, transaction);
  });

  describe('execute', () => {
    it('locks the order, then replaces its tags in the same transaction', async () => {
      const view = await replaceTagsCase.execute({ orderId: '600', tagIds: ['302'] });

      expect(view).toEqual({ tags: [{ id: '302', name: 'vip' }] });
      expect(repository.lockOne).toHaveBeenCalledWith('600');
      expect(tag.replace).toHaveBeenCalledWith({ orderId: '600', tagIds: ['302'] });
      expect(calls).toEqual(['begin', 'lockOne', 'replace', 'commit']);
    });

    it('refuses an unknown order with ORDER_NOT_FOUND and replaces nothing', async () => {
      repository.lockOne.mockResolvedValue(null);

      await expect(
        replaceTagsCase.execute({ orderId: '999', tagIds: ['302'] }),
      ).rejects.toMatchObject({
        code: 'ORDER_NOT_FOUND',
        message: 'Order 999 was not found',
      });
      expect(tag.replace).not.toHaveBeenCalled();
    });

    it('refuses missing tags with ORDER_TAG_NOT_FOUND and their ids, so the transaction rolls back', async () => {
      tag.replace.mockResolvedValue({
        outcome: OrderTagReplaceOutcomeEnum.TAG_NOT_FOUND,
        tags: [],
        missingTagIds: ['999'],
      });

      const replacing = replaceTagsCase.execute({ orderId: '600', tagIds: ['302', '999'] });

      await expect(replacing).rejects.toMatchObject({
        code: 'ORDER_TAG_NOT_FOUND',
        message: 'Some of the tags do not exist',
        details: { missingTagIds: ['999'] },
      });
      expect(calls).not.toContain('commit');
    });
  });
});
