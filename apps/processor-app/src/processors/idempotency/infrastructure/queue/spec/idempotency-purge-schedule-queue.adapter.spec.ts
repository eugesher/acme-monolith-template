import type { Queue } from 'bullmq';

import { IdempotencyPurgeScheduleQueueAdapter } from '../idempotency-purge-schedule-queue.adapter';

describe('IdempotencyPurgeScheduleQueueAdapter', () => {
  let queue: jest.Mocked<Pick<Queue, 'upsertJobScheduler'>>;
  let adapter: IdempotencyPurgeScheduleQueueAdapter;

  beforeEach(() => {
    queue = { upsertJobScheduler: jest.fn() };
    queue.upsertJobScheduler.mockResolvedValue({} as never);
    adapter = new IdempotencyPurgeScheduleQueueAdapter(queue as unknown as Queue);
  });

  describe('register', () => {
    it('upserts one scheduler under the name of the queue, so every replica keeps the same one', async () => {
      await adapter.register({ pattern: '*/5 * * * *' });

      expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
        'idempotency-purge',
        { pattern: '*/5 * * * *' },
        { name: 'idempotency-purge' },
      );
    });

    it('passes a failing upsert through', async () => {
      queue.upsertJobScheduler.mockRejectedValue(new Error('redis is down'));

      await expect(adapter.register({ pattern: '*/5 * * * *' })).rejects.toThrow('redis is down');
    });
  });
});
