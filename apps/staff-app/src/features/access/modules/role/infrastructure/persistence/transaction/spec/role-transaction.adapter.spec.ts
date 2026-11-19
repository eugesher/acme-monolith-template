import type { ITransactionPort } from '@acme-libs/contracts/local-storage';

import { RoleTransactionAdapter } from '../role-transaction.adapter';

describe('RoleTransactionAdapter', () => {
  let transaction: jest.Mocked<ITransactionPort>;
  let adapter: RoleTransactionAdapter;

  beforeEach(() => {
    transaction = { run: jest.fn(), afterCommit: jest.fn() };
    transaction.run.mockImplementation((work) => work());
    adapter = new RoleTransactionAdapter(transaction);
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
