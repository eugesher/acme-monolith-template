import { IdempotencyCoreCompleteCase } from '../idempotency-core-complete.case';

describe('IdempotencyCoreCompleteCase', () => {
  describe('execute', () => {
    it('stores the response as JSON under the key of the scope', async () => {
      const complete = jest.fn().mockResolvedValue(undefined);
      const completeCase = new IdempotencyCoreCompleteCase({ complete });

      await completeCase.execute({
        scope: 'customer:101',
        key: 'key-1',
        response: { id: '12', sku: 'A-1' },
      });

      expect(complete).toHaveBeenCalledWith({
        scope: 'customer:101',
        key: 'key-1',
        responseBody: '{"id":"12","sku":"A-1"}',
      });
    });

    it('lets a failed write reject', async () => {
      const complete = jest.fn().mockRejectedValue(new Error('connection lost'));
      const completeCase = new IdempotencyCoreCompleteCase({ complete });

      const execute = completeCase.execute({ scope: 'customer:101', key: 'key-1', response: {} });

      await expect(execute).rejects.toThrow('connection lost');
    });
  });
});
