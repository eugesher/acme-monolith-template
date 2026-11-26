import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { QueueDeleteFailedJobUseCase } from '../queue-delete-failed-job.use-case';
import type { IQueueRegistryPort } from '../../../outbound';
import type { QueueFailedJobService } from '../../services/queue-failed-job.service';

describe('QueueDeleteFailedJobUseCase', () => {
  let failedJobService: jest.Mocked<Pick<QueueFailedJobService, 'ensure'>>;
  let registry: jest.Mocked<IQueueRegistryPort>;
  let logger: PinoLoggerMock;
  let useCase: QueueDeleteFailedJobUseCase;

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
    registry.removeJob.mockResolvedValue({ record: { subjectId: '5' } });
    logger = makePinoLoggerMock();
    useCase = new QueueDeleteFailedJobUseCase(
      failedJobService as unknown as QueueFailedJobService,
      registry,
      logger,
    );
  });

  describe('execute', () => {
    it('removes the job once it is known to be failed and logs its data and who removed it', async () => {
      await useCase.execute({ queueName: 'ledger-append', jobId: '7', staffUserId: '1' });

      expect(failedJobService.ensure).toHaveBeenCalledWith({
        queueName: 'ledger-append',
        jobId: '7',
      });
      expect(registry.removeJob).toHaveBeenCalledWith({ queueName: 'ledger-append', jobId: '7' });
      expect(logger.warn).toHaveBeenCalledWith(
        {
          queueName: 'ledger-append',
          jobId: '7',
          staffUserId: '1',
          data: { record: { subjectId: '5' } },
        },
        'Failed job deleted',
      );
    });

    it('removes nothing when the check refuses the job', async () => {
      failedJobService.ensure.mockRejectedValue(new Error('not failed'));

      await expect(
        useCase.execute({ queueName: 'ledger-append', jobId: '7', staffUserId: '1' }),
      ).rejects.toThrow('not failed');
      expect(registry.removeJob).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
