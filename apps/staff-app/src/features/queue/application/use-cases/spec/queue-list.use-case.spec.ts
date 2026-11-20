import { QueueListUseCase } from '../queue-list.use-case';
import type { IQueueRegistryPort } from '../../../outbound';

describe('QueueListUseCase', () => {
  let registry: jest.Mocked<IQueueRegistryPort>;
  let useCase: QueueListUseCase;

  beforeEach(() => {
    registry = {
      has: jest.fn(),
      listJobCounts: jest.fn(),
      findFailedJobs: jest.fn(),
      findJobState: jest.fn(),
      retryJob: jest.fn(),
      removeJob: jest.fn(),
    };
    useCase = new QueueListUseCase(registry);
  });

  describe('execute', () => {
    it('answers the queues with their job counts', async () => {
      registry.listJobCounts.mockResolvedValue([
        {
          name: 'ledger-record',
          paused: false,
          jobCounts: { active: 0, completed: 0, failed: 2, delayed: 0, waiting: 1 },
        },
      ]);

      const queues = await useCase.execute();

      expect(queues).toEqual([
        {
          name: 'ledger-record',
          paused: false,
          jobCounts: { active: 0, completed: 0, failed: 2, delayed: 0, waiting: 1 },
        },
      ]);
    });
  });
});
