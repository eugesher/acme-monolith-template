import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IStaffAuthCoreUserReconstitute {
  id: string;
  passwordHash: string;
  status: UserStatusEnum;
}
