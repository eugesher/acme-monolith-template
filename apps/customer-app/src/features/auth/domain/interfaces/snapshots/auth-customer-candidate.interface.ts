import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IAuthCustomerCandidate {
  email: string;
  passwordHash: string;
  status: UserStatusEnum;
}
