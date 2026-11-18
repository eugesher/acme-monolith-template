import { QueryFailedError } from 'typeorm';

import { MysqlErrorHelper } from '../mysql-error.helper';

describe('MysqlErrorHelper', () => {
  describe('isDuplicateKey', () => {
    it('recognizes a duplicate entry by its errno', () => {
      const driverError = Object.assign(new Error('Duplicate entry'), { errno: 1062 });
      const error = new QueryFailedError('INSERT', [], driverError);

      expect(MysqlErrorHelper.isDuplicateKey(error)).toBe(true);
    });

    it('recognizes a duplicate entry by its code', () => {
      const driverError = Object.assign(new Error('Duplicate entry'), { code: 'ER_DUP_ENTRY' });
      const error = new QueryFailedError('INSERT', [], driverError);

      expect(MysqlErrorHelper.isDuplicateKey(error)).toBe(true);
    });

    it('rejects another query failure', () => {
      const driverError = Object.assign(new Error('Deadlock'), {
        errno: 1213,
        code: 'ER_LOCK_DEADLOCK',
      });
      const error = new QueryFailedError('UPDATE', [], driverError);

      expect(MysqlErrorHelper.isDuplicateKey(error)).toBe(false);
    });

    it('rejects an error that is not a query failure', () => {
      const error = Object.assign(new Error('Duplicate entry'), { errno: 1062 });

      expect(MysqlErrorHelper.isDuplicateKey(error)).toBe(false);
    });
  });

  describe('catchDuplicateKey', () => {
    it('answers what the statement answered', async () => {
      const statement = jest.fn().mockResolvedValue('12');

      const statementResult = await MysqlErrorHelper.catchDuplicateKey(statement);

      expect(statementResult).toBe('12');
      expect(statement).toHaveBeenCalledTimes(1);
    });

    it('answers null when the statement hits a duplicate key', async () => {
      const driverError = Object.assign(new Error('Duplicate entry'), { errno: 1062 });
      const statement = jest
        .fn()
        .mockRejectedValue(new QueryFailedError('INSERT', [], driverError));

      const statementResult = await MysqlErrorHelper.catchDuplicateKey(statement);

      expect(statementResult).toBeNull();
    });

    it('passes any other error through', async () => {
      const driverError = Object.assign(new Error('Deadlock'), { errno: 1213 });
      const deadlock = new QueryFailedError('UPDATE', [], driverError);
      const statement = jest.fn().mockRejectedValue(deadlock);

      await expect(MysqlErrorHelper.catchDuplicateKey(statement)).rejects.toBe(deadlock);
    });
  });
});
