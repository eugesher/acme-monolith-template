import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IStaffAuthCoreLoginReconstitute {
  id: string;
  passwordHash: string;
  status: UserStatusEnum;
}
