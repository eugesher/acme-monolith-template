import type { ReminderStatusEnum } from '@acme-libs/kernel';

export interface IReminderUpdateQuery {
  readonly id: string;
  readonly versionAsRead: number;
  readonly dueOn: string;
  readonly status: ReminderStatusEnum;
  readonly version: number;
}
