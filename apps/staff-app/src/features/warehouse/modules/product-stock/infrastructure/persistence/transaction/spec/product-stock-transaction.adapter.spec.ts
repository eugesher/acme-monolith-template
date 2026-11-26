import type { ITransactionPort } from '@acme-libs/contracts/local-storage';

import { ProductStockTransactionAdapter } from '../product-stock-transaction.adapter';

describe('ProductStockTransactionAdapter', () => {
  let transaction: jest.Mocked<ITransactionPort>;
  let adapter: ProductStockTransactionAdapter;

  beforeEach(() => {
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    transaction.run.mockImplementation((work) => work());
    adapter = new ProductStockTransactionAdapter(transaction);
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
