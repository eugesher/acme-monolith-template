import { UserStatusEnum } from '@acme-libs/kernel';

import type {
  IStaffAuthCoreLoginLoggerPayload,
  IStaffAuthCoreLoginReconstitute,
} from '../interfaces';

export class StaffAuthCoreLoginModel {
  private constructor(
    public readonly id: string,
    public readonly passwordHash: string,
    private readonly status: UserStatusEnum,
  ) {}

  public static reconstitute(record: IStaffAuthCoreLoginReconstitute): StaffAuthCoreLoginModel {
    const { id, passwordHash, status } = record;

    return new StaffAuthCoreLoginModel(id, passwordHash, status);
  }

  public isActive(): boolean {
    return this.status === UserStatusEnum.ACTIVE;
  }

  public toLoggerPayload(): IStaffAuthCoreLoginLoggerPayload {
    return { id: this.id };
  }
}
