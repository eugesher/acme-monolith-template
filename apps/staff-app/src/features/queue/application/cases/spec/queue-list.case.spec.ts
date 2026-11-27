import { QueueListCase } from '../queue-list.case';
import type { IQueueRegistryPort } from '../../../outbound';

describe('QueueListCase', () => {
  let registry: jest.Mocked<IQueueRegistryPort>;
  let listCase: QueueListCase;

  beforeEach(() => {
    registry = {
      has: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      findJobState: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    listCase = new QueueListCase(registry);
  });

  describe('execute', () => {
    it('answers the queues with their job counts', async () => {
      registry.listJobCounts.mockResolvedValue([
        {
          name: 'ledger-append',
          paused: false,
          jobCounts: { active: 0, completed: 0, failed: 2, delayed: 0, waiting: 1 },
        },
      ]);

      const queues = await listCase.execute();

      expect(queues).toEqual([
        {
          name: 'ledger-append',
          paused: false,
          jobCounts: { active: 0, completed: 0, failed: 2, delayed: 0, waiting: 1 },
        },
      ]);
    });
  });
});
