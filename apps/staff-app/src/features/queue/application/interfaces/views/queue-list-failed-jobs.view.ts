import type { IPage, Nullable } from '@acme-libs/toolkit';

export type IQueueListFailedJobsView = IPage<{
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
}>;
