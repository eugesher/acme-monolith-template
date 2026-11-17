import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IAuthCustomerLoginReconstitute {
  id: string;
  passwordHash: string;
  status: UserStatusEnum;
}
