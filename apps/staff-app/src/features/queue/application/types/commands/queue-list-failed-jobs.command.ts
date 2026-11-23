import type { Maybe } from '@acme-libs/toolkit';

export interface IQueueListFailedJobsCommand {
  queueName: string;
  page: Maybe<number>;
  limit: Maybe<number>;
}
