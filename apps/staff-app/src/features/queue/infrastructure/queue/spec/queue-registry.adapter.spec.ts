import type { Queue } from 'bullmq';

import { QueueRegistryAdapter } from '../queue-registry.adapter';

describe('QueueRegistryAdapter', () => {
  let ledgerQueue: jest.Mocked<
    Pick<Queue, 'name' | 'getJobCounts' | 'isPaused' | 'getFailed' | 'getFailedCount' | 'getJob'>
  >;
  let stockQueue: jest.Mocked<Pick<Queue, 'name' | 'getJobCounts' | 'isPaused'>>;
  let adapter: QueueRegistryAdapter;

  beforeEach(() => {
    ledgerQueue = {
      name: 'ledger-append',
      getJobCounts: jest.fn(),
      isPaused: jest.fn(),
      getFailed: jest.fn(),
      getFailedCount: jest.fn(),
      getJob: jest.fn(),
    };
    stockQueue = {
      name: 'product-stock-post-subtract',
      getJobCounts: jest.fn(),
      isPaused: jest.fn(),
    };
    adapter = new QueueRegistryAdapter(
      ledgerQueue as unknown as Queue,
      stockQueue as unknown as Queue,
    );
  });

  describe('has', () => {
    it('knows the injected queues by their names only', () => {
      expect(adapter.has('ledger-append')).toBe(true);
      expect(adapter.has('product-stock-post-subtract')).toBe(true);
      expect(adapter.has('unknown')).toBe(false);
    });
  });

  describe('listJobCounts', () => {
    it('answers every queue with its pause and the five counts it asks for', async () => {
      ledgerQueue.getJobCounts.mockResolvedValue({
        active: 0,
        completed: 0,
        failed: 2,
        delayed: 0,
        waiting: 1,
      });
      ledgerQueue.isPaused.mockResolvedValue(false);
      stockQueue.getJobCounts.mockResolvedValue({
        active: 1,
        completed: 0,
        failed: 0,
        delayed: 0,
        waiting: 3,
        prioritized: 4,
      });
      stockQueue.isPaused.mockResolvedValue(true);

      const queues = await adapter.listJobCounts();

      expect(queues).toEqual([
        {
          name: 'ledger-append',
          paused: false,
          jobCounts: { active: 0, completed: 0, failed: 2, delayed: 0, waiting: 1 },
        },
        {
          name: 'product-stock-post-subtract',
          paused: true,
          jobCounts: { active: 1, completed: 0, failed: 0, delayed: 0, waiting: 3 },
        },
      ]);
      expect(ledgerQueue.getJobCounts).toHaveBeenCalledWith(
        'active',
        'completed',
        'failed',
        'delayed',
        'waiting',
      );
    });
  });

  describe('findFailedJobs', () => {
    it('answers the failed jobs in the window with ISO instants, and their total', async () => {
      ledgerQueue.getFailed.mockResolvedValue([
        {
          id: '7',
          name: 'ledger-append',
          data: { operationKey: 'product-created:12' },
          opts: { attempts: 3 },
          attemptsMade: 3,
          failedReason: 'Data too long for column',
          stacktrace: ['Error: Data too long for column'],
          timestamp: Date.UTC(2026, 0, 1, 0, 0, 0),
          processedOn: Date.UTC(2026, 0, 1, 0, 0, 1),
          finishedOn: Date.UTC(2026, 0, 1, 0, 0, 2),
        },
        {
          id: '8',
          name: 'ledger-append',
          data: {},
          opts: { attempts: 0 },
          attemptsMade: 0,
          failedReason: '',
          stacktrace: [],
          timestamp: Date.UTC(2026, 0, 1, 0, 0, 0),
          processedOn: undefined,
          finishedOn: undefined,
        },
      ] as never);
      ledgerQueue.getFailedCount.mockResolvedValue(21);

      const failed = await adapter.findFailedJobs({
        queueName: 'ledger-append',
        offset: 20,
        limit: 20,
      });

      expect(failed).toEqual([
        [
          {
            id: '7',
            name: 'ledger-append',
            data: { operationKey: 'product-created:12' },
            attempts: 3,
            attemptsMade: 3,
            failedReason: 'Data too long for column',
            stacktrace: ['Error: Data too long for column'],
            createdAt: '2026-01-01T00:00:00.000Z',
            processedAt: '2026-01-01T00:00:01.000Z',
            failedAt: '2026-01-01T00:00:02.000Z',
          },
          {
            id: '8',
            name: 'ledger-append',
            data: {},
            attempts: 0,
            attemptsMade: 0,
            failedReason: '',
            stacktrace: [],
            createdAt: '2026-01-01T00:00:00.000Z',
            processedAt: null,
            failedAt: null,
          },
        ],
        21,
      ]);
      expect(ledgerQueue.getFailed).toHaveBeenCalledWith(20, 39);
    });

    it('throws for a queue it does not hold', async () => {
      await expect(
        adapter.findFailedJobs({ queueName: 'unknown', offset: 0, limit: 20 }),
      ).rejects.toThrow('Queue unknown is not registered');
    });
  });

  describe('findJobState', () => {
    it('answers the state of the job', async () => {
      ledgerQueue.getJob.mockResolvedValue({
        getState: jest.fn().mockResolvedValue('failed'),
      } as never);

      const state = await adapter.findJobState({ queueName: 'ledger-append', jobId: '7' });

      expect(state).toBe('failed');
      expect(ledgerQueue.getJob).toHaveBeenCalledWith('7');
    });

    it('answers null for a job the queue does not hold', async () => {
      ledgerQueue.getJob.mockResolvedValue(undefined);

      const state = await adapter.findJobState({ queueName: 'ledger-append', jobId: '7' });

      expect(state).toBeNull();
    });
  });

  describe('retryJob', () => {
    it('retries the job', async () => {
      const retry = jest.fn().mockResolvedValue(undefined);

      ledgerQueue.getJob.mockResolvedValue({ retry } as never);

      await adapter.retryJob({ queueName: 'ledger-append', jobId: '7' });

      expect(retry).toHaveBeenCalledTimes(1);
    });

    it('does nothing for a job that is gone', async () => {
      ledgerQueue.getJob.mockResolvedValue(undefined);

      await expect(
        adapter.retryJob({ queueName: 'ledger-append', jobId: '7' }),
      ).resolves.toBeUndefined();
    });
  });

  describe('removeJob', () => {
    it('removes the job and returns its data', async () => {
      const remove = jest.fn().mockResolvedValue(undefined);

      ledgerQueue.getJob.mockResolvedValue({
        remove,
        data: { record: { subjectId: '5' } },
      } as never);

      const data = await adapter.removeJob({ queueName: 'ledger-append', jobId: '7' });

      expect(remove).toHaveBeenCalledTimes(1);
      expect(data).toEqual({ record: { subjectId: '5' } });
    });

    it('does nothing for a job that is gone', async () => {
      ledgerQueue.getJob.mockResolvedValue(undefined);

      await expect(
        adapter.removeJob({ queueName: 'ledger-append', jobId: '7' }),
      ).resolves.toBeUndefined();
    });
  });
});
