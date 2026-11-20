import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { QueueRetryFailedJobUseCase } from '../queue-retry-failed-job.use-case';
import type { IQueueRegistryPort } from '../../../outbound';
import type { QueueFailedJobService } from '../../services/queue-failed-job.service';

describe('QueueRetryFailedJobUseCase', () => {
  let failedJobService: jest.Mocked<Pick<QueueFailedJobService, 'ensure'>>;
  let registry: jest.Mocked<IQueueRegistryPort>;
  let logger: PinoLoggerMock;
  let useCase: QueueRetryFailedJobUseCase;

  beforeEach(() => {
    failedJobService = { ensure: jest.fn() };
    failedJobService.ensure.mockResolvedValue(undefined);
    registry = {
      has: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      findJobState: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    registry.retryJob.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new QueueRetryFailedJobUseCase(
      failedJobService as unknown as QueueFailedJobService,
      registry,
      logger,
    );
  });

  describe('execute', () => {
    it('retries the job once it is known to be failed and logs who retried it', async () => {
      await useCase.execute({ queueName: 'ledger-record', jobId: '7', staffUserId: '1' });

      expect(failedJobService.ensure).toHaveBeenCalledWith({
        queueName: 'ledger-record',
        jobId: '7',
      });
      expect(registry.retryJob).toHaveBeenCalledWith({ queueName: 'ledger-record', jobId: '7' });
      expect(logger.info).toHaveBeenCalledWith(
        { queueName: 'ledger-record', jobId: '7', staffUserId: '1' },
        'Failed job returned to the queue',
      );
    });

    it('retries nothing when the check refuses the job', async () => {
      failedJobService.ensure.mockRejectedValue(new Error('not failed'));

      await expect(
        useCase.execute({ queueName: 'ledger-record', jobId: '7', staffUserId: '1' }),
      ).rejects.toThrow('not failed');
      expect(registry.retryJob).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
