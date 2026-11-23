import type {
  IUserStaffUserRegisterLoggerPayload,
  IUserStaffUserRegisterReconstitute,
  IUserStaffUserRegisterSnapshot,
} from '../types';

export class UserStaffUserRegisterModel {
  private constructor(
    private readonly id: string,
    private readonly email: string,
  ) {}

  public static reconstitute(
    record: IUserStaffUserRegisterReconstitute,
  ): UserStaffUserRegisterModel {
    const { id, email } = record;

    return new UserStaffUserRegisterModel(id, email);
  }

  public toLoggerPayload(): IUserStaffUserRegisterLoggerPayload {
    return { id: this.id };
  }

  public toSnapshot(): IUserStaffUserRegisterSnapshot {
    return { id: this.id, email: this.email };
  }
}
