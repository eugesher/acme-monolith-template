import type { ReminderStatusEnum } from '@acme-libs/kernel';

export interface IReminderCandidate {
  ownerId: string;
  title: string;
  body: string;
  dueOn: string;
  status: ReminderStatusEnum;
  version: number;
}
