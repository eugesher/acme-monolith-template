import { QueueGetManyCase } from '../queue-get-many.case';
import type { IQueueRegistryPort } from '../../../outbound';

describe('QueueGetManyCase', () => {
  let registry: jest.Mocked<IQueueRegistryPort>;
  let getManyCase: QueueGetManyCase;

  beforeEach(() => {
    registry = {
      has: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      findJobState: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    getManyCase = new QueueGetManyCase(registry);
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

      const queues = await getManyCase.execute();

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
