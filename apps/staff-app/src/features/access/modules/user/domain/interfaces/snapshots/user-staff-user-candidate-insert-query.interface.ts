import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IUserStaffUserCandidateInsertQuery {
  readonly email: string;
  readonly passwordHash: string;
  readonly status: UserStatusEnum;
}
