import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { JobsOptions, Queue } from 'bullmq';

import { LEDGER_RECORD_QUEUE } from '@acme-core/contracts/ledger';
import { PRODUCT_STOCK_POST_SUBTRACT_QUEUE } from '@acme-core/contracts/product-stock';
import type { Maybe, Nullable } from '@acme-libs/toolkit';

import {
  QUEUE_REGISTRY_PORT,
  type IQueueRegistryFailedJobsView,
  type IQueueRegistryFailedJobView,
  type IQueueRegistryFindFailedJobsCommand,
  type IQueueRegistryJobCommand,
  type IQueueRegistryJobCountsView,
  type IQueueRegistryPort,
} from '../../outbound';

@Injectable()
export class QueueRegistryAdapter implements IQueueRegistryPort {
  public static readonly provider: ClassProvider<IQueueRegistryPort> = {
    provide: QUEUE_REGISTRY_PORT,
    useClass: QueueRegistryAdapter,
  };

  private readonly queues: Map<string, Queue>;

  constructor(
    @InjectQueue(LEDGER_RECORD_QUEUE)
    ledgerRecordQueue: Queue,
    @InjectQueue(PRODUCT_STOCK_POST_SUBTRACT_QUEUE)
    postSubtractQueue: Queue,
  ) {
    this.queues = new Map(
      [ledgerRecordQueue, postSubtractQueue].map((queue) => [queue.name, queue]),
    );
  }

  public has(queueName: string): boolean {
    return this.queues.has(queueName);
  }

  public async listJobCounts(): Promise<IQueueRegistryJobCountsView[]> {
    const queues = [...this.queues.values()];

    return await Promise.all(
      queues.map(async (queue) => {
        const [jobCounts, paused] = await Promise.all([
          queue.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting'),
          queue.isPaused(),
        ]);
        const { active, completed, failed, delayed, waiting } = jobCounts;

        return {
          name: queue.name,
          paused,
          jobCounts: { active, completed, failed, delayed, waiting },
        };
      }),
    );
  }

  public async findFailedJobs(
    command: IQueueRegistryFindFailedJobsCommand,
  ): Promise<IQueueRegistryFailedJobsView> {
    const { queueName, offset, limit } = command;
    const queue = this.queueOf(queueName);

    const [jobs, total] = await Promise.all([
      queue.getFailed(offset, offset + limit - 1),
      queue.getFailedCount(),
    ]);
    const failedJobs = jobs.map((job) => QueueRegistryAdapter.toFailedJob(job));

    return [failedJobs, total];
  }

  public async findJobState(command: IQueueRegistryJobCommand): Promise<Nullable<string>> {
    const { queueName, jobId } = command;
    const job = await this.queueOf(queueName).getJob(jobId);

    return job ? await job.getState() : null;
  }

  public async retryJob(command: IQueueRegistryJobCommand): Promise<void> {
    const { queueName, jobId } = command;
    const job = await this.queueOf(queueName).getJob(jobId);

    await job?.retry();
  }

  public async removeJob(command: IQueueRegistryJobCommand): Promise<unknown> {
    const { queueName, jobId } = command;
    const job = await this.queueOf(queueName).getJob(jobId);

    await job?.remove();

    return job?.data;
  }

  private static toFailedJob(
    job: Awaited<ReturnType<Queue['getFailed']>>[number],
  ): IQueueRegistryFailedJobView {
    const { id, name, opts, attemptsMade, failedReason, timestamp, processedOn, finishedOn } = job;
    const { attempts } = opts as Required<Pick<JobsOptions, 'attempts'>>;
    const { stacktrace } = job as { stacktrace: string[] };
    const data: unknown = job.data;
    const createdAt = new Date(timestamp).toISOString();
    const processedAt = QueueRegistryAdapter.toInstant(processedOn);
    const failedAt = QueueRegistryAdapter.toInstant(finishedOn);

    return {
      id: String(id),
      name,
      data,
      attempts,
      attemptsMade,
      failedReason,
      stacktrace,
      createdAt,
      processedAt,
      failedAt,
    };
  }

  private static toInstant(epochMs: Maybe<number>): Nullable<string> {
    return typeof epochMs === 'number' ? new Date(epochMs).toISOString() : null;
  }

  private queueOf(queueName: string): Queue {
    const queue = this.queues.get(queueName);

    if (!queue) {
      throw new Error(`Queue ${queueName} is not registered`);
    }

    return queue;
  }
}
