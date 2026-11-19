import { JobFailureHelper } from '../job-failure.helper';

describe('JobFailureHelper', () => {
  describe('report', () => {
    let warn: jest.Mock;
    let error: jest.Mock;

    beforeEach(() => {
      warn = jest.fn();
      error = jest.fn();
    });

    it('logs a failed attempt with attempts left as a retry', () => {
      JobFailureHelper.report({
        logger: { warn, error },
        label: 'Item sync',
        context: { itemId: '7' },
        attempt: 1,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(warn).toHaveBeenCalledWith(
        { err: new Error('deadlock'), itemId: '7', attempt: 1, attempts: 3 },
        'Item sync failed, Bull retries the job',
      );
      expect(error).not.toHaveBeenCalled();
    });

    it('logs the last failed attempt for a replay', () => {
      JobFailureHelper.report({
        logger: { warn, error },
        label: 'Item sync',
        context: { itemId: '7' },
        attempt: 3,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(error).toHaveBeenCalledWith(
        { err: new Error('deadlock'), itemId: '7', attempt: 3, attempts: 3 },
        'Item sync failed permanently: the job stays in the failed set of the queue, replay it',
      );
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
