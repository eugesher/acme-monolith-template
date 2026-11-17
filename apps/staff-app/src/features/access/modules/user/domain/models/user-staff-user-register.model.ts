import type {
  IUserStaffUserRegisterLoggerPayload,
  IUserStaffUserRegisterReconstitute,
  IUserStaffUserRegisterSnapshot,
} from '../interfaces';

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

  public toSnapshot(): IUserStaffUserRegisterSnapshot {
    return { id: this.id, email: this.email };
  }

  public toLoggerPayload(): IUserStaffUserRegisterLoggerPayload {
    return { id: this.id };
  }
}
