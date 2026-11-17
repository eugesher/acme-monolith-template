import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IUserStaffUserCandidateInsertPayload {
  readonly email: string;
  readonly passwordHash: string;
  readonly status: UserStatusEnum;
}
