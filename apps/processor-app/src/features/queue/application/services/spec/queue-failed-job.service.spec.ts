import { QueueFailedJobService } from '../queue-failed-job.service';
import type { IQueueRegistryPort } from '../../../outbound';

describe('QueueFailedJobService', () => {
  let registry: jest.Mocked<IQueueRegistryPort>;
  let service: QueueFailedJobService;

  beforeEach(() => {
    registry = {
      has: jest.fn(),
      findJobState: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    registry.has.mockReturnValue(true);
    registry.findJobState.mockResolvedValue('failed');
    service = new QueueFailedJobService(registry);
  });

  describe('ensure', () => {
    it('passes a failed job of a known queue', async () => {
      await service.ensure({ queueName: 'ledger-record', jobId: '7' });

      expect(registry.has).toHaveBeenCalledWith('ledger-record');
      expect(registry.findJobState).toHaveBeenCalledWith({
        queueName: 'ledger-record',
        jobId: '7',
      });
    });

    it('refuses an unknown queue with QUEUE_NOT_FOUND', async () => {
      registry.has.mockReturnValue(false);

      await expect(service.ensure({ queueName: 'unknown', jobId: '7' })).rejects.toMatchObject({
        code: 'QUEUE_NOT_FOUND',
        message: 'Queue unknown was not found',
      });
      expect(registry.findJobState).not.toHaveBeenCalled();
    });

    it('refuses a missing job with QUEUE_JOB_NOT_FOUND', async () => {
      registry.findJobState.mockResolvedValue(null);

      await expect(
        service.ensure({ queueName: 'ledger-record', jobId: '7' }),
      ).rejects.toMatchObject({
        code: 'QUEUE_JOB_NOT_FOUND',
        message: 'Job 7 was not found in queue ledger-record',
      });
    });

    it('refuses a job that is not failed with QUEUE_JOB_NOT_FAILED', async () => {
      registry.findJobState.mockResolvedValue('waiting');

      await expect(
        service.ensure({ queueName: 'ledger-record', jobId: '7' }),
      ).rejects.toMatchObject({
        code: 'QUEUE_JOB_NOT_FAILED',
        message: 'Job 7 of queue ledger-record is waiting, not failed',
      });
    });
  });
});
