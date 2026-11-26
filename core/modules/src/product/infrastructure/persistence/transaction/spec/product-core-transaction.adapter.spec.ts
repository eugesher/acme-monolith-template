import type { ITransactionPort } from '@acme-libs/contracts/local-storage';

import { ProductCoreTransactionAdapter } from '../product-core-transaction.adapter';

describe('ProductCoreTransactionAdapter', () => {
  let transaction: jest.Mocked<ITransactionPort>;
  let adapter: ProductCoreTransactionAdapter;

  beforeEach(() => {
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    transaction.run.mockImplementation((work) => work());
    adapter = new ProductCoreTransactionAdapter(transaction);
  });

  describe('run', () => {
    it('runs the work in a transaction of the local storage lib and answers its result', async () => {
      const work = jest.fn().mockResolvedValue('result');

      const result = await adapter.run(work);

      expect(result).toBe('result');
      expect(transaction.run).toHaveBeenCalledWith(work);
    });
  });

  describe('afterCommit', () => {
    it('queues the hook on the transaction of the local storage lib', () => {
      const hook = jest.fn();

      adapter.afterCommit(hook);

      expect(transaction.afterCommit).toHaveBeenCalledWith(hook);
    });
  });
});
