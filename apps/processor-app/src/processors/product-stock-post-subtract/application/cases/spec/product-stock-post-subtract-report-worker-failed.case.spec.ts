import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { ProductStockPostSubtractReportWorkerFailedCase } from '../product-stock-post-subtract-report-worker-failed.case';

describe('ProductStockPostSubtractReportWorkerFailedCase', () => {
  let logger: PinoLoggerMock;
  let reportWorkerFailedCase: ProductStockPostSubtractReportWorkerFailedCase;

  beforeEach(() => {
    logger = makePinoLoggerMock();
    reportWorkerFailedCase = new ProductStockPostSubtractReportWorkerFailedCase(logger);
  });

  describe('execute', () => {
    it('logs a failed attempt with attempts left as a retry', () => {
      reportWorkerFailedCase.execute({
        productIds: ['100', '106'],
        attempt: 1,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(logger.warn).toHaveBeenCalledWith(
        {
          err: new Error('deadlock'),
          productIds: ['100', '106'],
          attempt: 1,
          attempts: 3,
        },
        'Post-subtract check failed, Bull retries the job',
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('logs the last failed attempt for a replay', () => {
      reportWorkerFailedCase.execute({
        productIds: ['100', '106'],
        attempt: 3,
        attempts: 3,
        error: new Error('deadlock'),
      });

      expect(logger.error).toHaveBeenCalledWith(
        {
          err: new Error('deadlock'),
          productIds: ['100', '106'],
          attempt: 3,
          attempts: 3,
        },
        'Post-subtract check failed permanently: the job stays in the failed set of the queue, replay it',
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
