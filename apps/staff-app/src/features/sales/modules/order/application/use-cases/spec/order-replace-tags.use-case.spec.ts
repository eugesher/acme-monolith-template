import { OrderNotFoundException, OrderTagNotFoundException } from '../../../domain';
import {
  OrderTagReplaceOutcomeEnum,
  type IOrderReplaceTagsRepositoryPort,
  type IOrderTagPort,
  type IOrderTransactionPort,
} from '../../../outbound';
import { OrderReplaceTagsUseCase } from '../order-replace-tags.use-case';

describe('OrderReplaceTagsUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<IOrderReplaceTagsRepositoryPort>;
  let tag: jest.Mocked<IOrderTagPort>;
  let transaction: jest.Mocked<IOrderTransactionPort>;
  let useCase: OrderReplaceTagsUseCase;

  beforeEach(() => {
    calls = [];
    repository = { lockById: jest.fn() };
    repository.lockById.mockImplementation(() => {
      calls.push('lockById');

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
    useCase = new OrderReplaceTagsUseCase(repository, tag, transaction);
  });

  describe('execute', () => {
    it('locks the order, then replaces its tags in the same transaction', async () => {
      const view = await useCase.execute({ orderId: '600', tagIds: ['302'] });

      expect(view).toEqual({ tags: [{ id: '302', name: 'vip' }] });
      expect(repository.lockById).toHaveBeenCalledWith('600');
      expect(tag.replace).toHaveBeenCalledWith({ orderId: '600', tagIds: ['302'] });
      expect(calls).toEqual(['begin', 'lockById', 'replace', 'commit']);
    });

    it('throws OrderNotFoundException and replaces nothing for an unknown order', async () => {
      repository.lockById.mockResolvedValue(null);

      await expect(useCase.execute({ orderId: '999', tagIds: ['302'] })).rejects.toThrow(
        OrderNotFoundException,
      );
      expect(tag.replace).not.toHaveBeenCalled();
    });

    it('throws OrderTagNotFoundException with the missing tags, so the transaction rolls back', async () => {
      tag.replace.mockResolvedValue({
        outcome: OrderTagReplaceOutcomeEnum.TAG_NOT_FOUND,
        tags: [],
        missingTagIds: ['999'],
      });

      const error: unknown = await useCase
        .execute({ orderId: '600', tagIds: ['302', '999'] })
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(OrderTagNotFoundException);
      expect(error).toMatchObject({ details: { missingTagIds: ['999'] } });
      expect(calls).not.toContain('commit');
    });
  });
});
