import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IAuthCustomerReconstitute {
  id: string;
  passwordHash: string;
  status: UserStatusEnum;
}
