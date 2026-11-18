import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IAuthStaffUserLoginReconstitute {
  id: string;
  passwordHash: string;
  status: UserStatusEnum;
}
