import type { UserStatusEnum } from '@acme-libs/kernel';

export interface IAuthCustomerCandidateInsertPayload {
  email: string;
  passwordHash: string;
  status: UserStatusEnum;
}
