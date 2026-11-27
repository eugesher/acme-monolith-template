import type { Maybe } from '@acme-libs/toolkit';

export interface IQueueGetFailedJobsCommand {
  queueName: string;
  page: Maybe<number>;
  limit: Maybe<number>;
}
