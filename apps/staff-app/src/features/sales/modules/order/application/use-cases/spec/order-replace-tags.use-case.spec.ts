import { OrderNotFoundException, OrderTagNotFoundException } from '../../../domain';
import { OrderReplaceTagsUseCase } from '../order-replace-tags.use-case';

describe('OrderReplaceTagsUseCase', () => {
  let calls: string[];
  let lockById: jest.Mock;
  let replace: jest.Mock;
  let run: jest.Mock;
  let useCase: OrderReplaceTagsUseCase;

  beforeEach(() => {
    calls = [];
    lockById = jest.fn(() => {
      calls.push('lockById');

      return Promise.resolve({ id: '600' });
    });
    replace = jest.fn(() => {
      calls.push('replace');

      return Promise.resolve({
        outcome: 'replaced',
        tags: [{ id: '302', name: 'vip' }],
        missingTagIds: [],
      });
    });
    run = jest.fn(async (work: () => Promise<unknown>) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    useCase = new OrderReplaceTagsUseCase(
      { lockById },
      { find: jest.fn(), replace, findOrderIds: jest.fn() },
      { run },
    );
  });

  describe('execute', () => {
    it('locks the order, then replaces its tags in the same transaction', async () => {
      const view = await useCase.execute({ orderId: '600', tagIds: ['302'] });

      expect(view).toEqual({ tags: [{ id: '302', name: 'vip' }] });
      expect(lockById).toHaveBeenCalledWith('600');
      expect(replace).toHaveBeenCalledWith({ orderId: '600', tagIds: ['302'] });
      expect(calls).toEqual(['begin', 'lockById', 'replace', 'commit']);
    });

    it('throws OrderNotFoundException and replaces nothing for an unknown order', async () => {
      lockById.mockResolvedValue(null);

      await expect(useCase.execute({ orderId: '999', tagIds: ['302'] })).rejects.toThrow(
        OrderNotFoundException,
      );
      expect(replace).not.toHaveBeenCalled();
    });

    it('throws OrderTagNotFoundException with the missing tags, so the transaction rolls back', async () => {
      replace.mockResolvedValue({ outcome: 'tag-not-found', tags: [], missingTagIds: ['999'] });

      const error: unknown = await useCase
        .execute({ orderId: '600', tagIds: ['302', '999'] })
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(OrderTagNotFoundException);
      expect(error).toMatchObject({ details: { missingTagIds: ['999'] } });
      expect(calls).not.toContain('commit');
    });
  });
});
