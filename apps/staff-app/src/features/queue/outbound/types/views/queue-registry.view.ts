import type { Nullable } from '@acme-libs/toolkit';

export interface IQueueRegistryJobCountsView {
  name: string;
  paused: boolean;
  jobCounts: {
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    waiting: number;
  };
}

export interface IQueueRegistryFailedJobView {
  id: string;
  name: string;
  data: unknown;
  attempts: number;
  attemptsMade: number;
  failedReason: Nullable<string>;
  stacktrace: string[];
  createdAt: string;
  processedAt: Nullable<string>;
  failedAt: Nullable<string>;
}

export type IQueueRegistryFailedJobsView = [IQueueRegistryFailedJobView[], number];
