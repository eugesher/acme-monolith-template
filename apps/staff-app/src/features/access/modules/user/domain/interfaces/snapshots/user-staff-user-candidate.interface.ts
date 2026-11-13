import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IUserStaffUserCandidate {
  email: string;
  passwordHash: string;
  status: UserStatusEnum;
  roleIds: string[];
}
