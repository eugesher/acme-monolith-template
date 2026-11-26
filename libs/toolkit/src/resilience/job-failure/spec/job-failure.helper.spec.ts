import { JobFailureHelper } from '../job-failure.helper';
import type { IHelperLogger } from '../../../types/helper-logger.interface';

describe('JobFailureHelper', () => {
  describe('report', () => {
    let logger: jest.Mocked<IHelperLogger>;

    beforeEach(() => {
      logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    });

    it('logs a failed attempt with attempts left as a retry', () => {
      JobFailureHelper.report({
        logger,
        label: 'Item sync',
        context: { itemId: '7' },
        attempt: 1,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(logger.warn).toHaveBeenCalledWith(
        { err: new Error('deadlock'), itemId: '7', attempt: 1, attempts: 3 },
        'Item sync failed, Bull retries the job',
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('logs the last failed attempt for a replay', () => {
      JobFailureHelper.report({
        logger,
        label: 'Item sync',
        context: { itemId: '7' },
        attempt: 3,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(logger.error).toHaveBeenCalledWith(
        { err: new Error('deadlock'), itemId: '7', attempt: 3, attempts: 3 },
        'Item sync failed permanently: the job stays in the failed set of the queue, replay it',
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
