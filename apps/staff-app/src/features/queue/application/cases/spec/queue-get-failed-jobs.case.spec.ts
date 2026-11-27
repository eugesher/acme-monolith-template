import { QueueGetFailedJobsCase } from '../queue-get-failed-jobs.case';
import type { IQueueRegistryPort } from '../../../outbound';

describe('QueueGetFailedJobsCase', () => {
  let registry: jest.Mocked<IQueueRegistryPort>;
  let getFailedJobsCase: QueueGetFailedJobsCase;

  beforeEach(() => {
    registry = {
      has: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      findJobState: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    registry.has.mockReturnValue(true);
    registry.findFailedJobs.mockResolvedValue([[], 0]);
    getFailedJobsCase = new QueueGetFailedJobsCase(registry);
  });

  describe('execute', () => {
    it('answers a page of the failed jobs for the clamped window', async () => {
      registry.findFailedJobs.mockResolvedValue([
        [
          {
            id: '7',
            name: '__default__',
            data: { subjectId: '12' },
            attempts: 3,
            attemptsMade: 3,
            failedReason: 'deadlock',
            stacktrace: [],
            createdAt: '2026-01-05T08:00:00.000Z',
            processedAt: '2026-01-05T08:00:01.000Z',
            failedAt: '2026-01-05T08:00:02.000Z',
          },
        ],
        21,
      ]);

      const page = await getFailedJobsCase.execute({
        queueName: 'ledger-append',
        page: 2,
        limit: 20,
      });

      expect(page).toEqual({
        page: 2,
        limit: 20,
        count: 1,
        pageCount: 2,
        total: 21,
        data: [
          {
            id: '7',
            name: '__default__',
            data: { subjectId: '12' },
            attempts: 3,
            attemptsMade: 3,
            failedReason: 'deadlock',
            stacktrace: [],
            createdAt: '2026-01-05T08:00:00.000Z',
            processedAt: '2026-01-05T08:00:01.000Z',
            failedAt: '2026-01-05T08:00:02.000Z',
          },
        ],
      });
      expect(registry.findFailedJobs).toHaveBeenCalledWith({
        queueName: 'ledger-append',
        offset: 20,
        limit: 20,
      });
    });

    it('starts at the first page of 20 jobs by default', async () => {
      await getFailedJobsCase.execute({
        queueName: 'ledger-append',
        page: undefined,
        limit: undefined,
      });

      expect(registry.findFailedJobs).toHaveBeenCalledWith({
        queueName: 'ledger-append',
        offset: 0,
        limit: 20,
      });
    });

    it('refuses an unknown queue with QUEUE_NOT_FOUND', async () => {
      registry.has.mockReturnValue(false);

      await expect(
        getFailedJobsCase.execute({ queueName: 'unknown', page: undefined, limit: undefined }),
      ).rejects.toMatchObject({
        code: 'QUEUE_NOT_FOUND',
      });
      expect(registry.findFailedJobs).not.toHaveBeenCalled();
    });
  });
});
