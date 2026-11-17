import type { ReminderStatusEnum } from '@acme-libs/kernel';

export interface IReminderUpdatePayload {
  readonly id: string;
  readonly versionAsRead: number;
  readonly dueOn: string;
  readonly status: ReminderStatusEnum;
  readonly version: number;
}
