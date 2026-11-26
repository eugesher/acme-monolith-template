import type { ITransactionPort } from '@acme-libs/contracts/local-storage';

import { OrderTransactionAdapter } from '../order-transaction.adapter';

describe('OrderTransactionAdapter', () => {
  let transaction: jest.Mocked<ITransactionPort>;
  let adapter: OrderTransactionAdapter;

  beforeEach(() => {
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    transaction.run.mockImplementation((work) => work());
    adapter = new OrderTransactionAdapter(transaction);
  });

  describe('run', () => {
    it('runs the work in a transaction of the local storage lib and answers its result', async () => {
      const work = jest.fn().mockResolvedValue('result');

      const result = await adapter.run(work);

      expect(result).toBe('result');
      expect(transaction.run).toHaveBeenCalledWith(work);
    });
  });
});
