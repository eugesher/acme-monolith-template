import { QueueController } from '../queue.controller';
import type {
  QueueDeleteFailedJobUseCase,
  QueueListFailedJobsUseCase,
  QueueListUseCase,
  QueueRetryFailedJobUseCase,
} from '../../application';

describe('QueueController', () => {
  let list: jest.Mocked<Pick<QueueListUseCase, 'execute'>>;
  let listFailedJobs: jest.Mocked<Pick<QueueListFailedJobsUseCase, 'execute'>>;
  let retryFailedJob: jest.Mocked<Pick<QueueRetryFailedJobUseCase, 'execute'>>;
  let deleteFailedJob: jest.Mocked<Pick<QueueDeleteFailedJobUseCase, 'execute'>>;
  let controller: QueueController;

  beforeEach(() => {
    list = { execute: jest.fn() };
    list.execute.mockResolvedValue([]);
    listFailedJobs = { execute: jest.fn() };
    listFailedJobs.execute.mockResolvedValue({
      page: 1,
      limit: 20,
      count: 0,
      pageCount: 0,
      total: 0,
      data: [],
    });
    retryFailedJob = { execute: jest.fn() };
    retryFailedJob.execute.mockResolvedValue(undefined);
    deleteFailedJob = { execute: jest.fn() };
    deleteFailedJob.execute.mockResolvedValue(undefined);
    controller = new QueueController(
      list as unknown as QueueListUseCase,
      listFailedJobs as unknown as QueueListFailedJobsUseCase,
      retryFailedJob as unknown as QueueRetryFailedJobUseCase,
      deleteFailedJob as unknown as QueueDeleteFailedJobUseCase,
    );
  });

  describe('handleList', () => {
    it('answers the queues of the use case', async () => {
      const response = await controller.handleList();

      expect(response).toEqual([]);
      expect(list.execute).toHaveBeenCalledWith();
    });
  });

  describe('handleListFailedJobs', () => {
    it('answers the page for the queue of the path and the window of the query string', async () => {
      const response = await controller.handleListFailedJobs(
        { queueName: 'ledger-record' },
        { page: 2, limit: 10 },
      );

      expect(response).toEqual({
        page: 1,
        limit: 20,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });
      expect(listFailedJobs.execute).toHaveBeenCalledWith({
        queueName: 'ledger-record',
        page: 2,
        limit: 10,
      });
    });
  });

  describe('handleRetryFailedJob', () => {
    it('retries the job of the path on behalf of the current user', async () => {
      await controller.handleRetryFailedJob(
        { queueName: 'ledger-record', jobId: '7' },
        { id: '1', email: 'admin@example.com' },
      );

      expect(retryFailedJob.execute).toHaveBeenCalledWith({
        queueName: 'ledger-record',
        jobId: '7',
        staffUserId: '1',
      });
    });

    it('lets a failed retry reject', async () => {
      retryFailedJob.execute.mockRejectedValue(new Error('job is not failed'));

      const retry = controller.handleRetryFailedJob(
        { queueName: 'ledger-record', jobId: '7' },
        { id: '1', email: 'admin@example.com' },
      );

      await expect(retry).rejects.toThrow('job is not failed');
    });
  });

  describe('handleDeleteFailedJob', () => {
    it('deletes the job of the path on behalf of the current user', async () => {
      await controller.handleDeleteFailedJob(
        { queueName: 'ledger-record', jobId: '7' },
        { id: '1', email: 'admin@example.com' },
      );

      expect(deleteFailedJob.execute).toHaveBeenCalledWith({
        queueName: 'ledger-record',
        jobId: '7',
        staffUserId: '1',
      });
    });
  });
});
