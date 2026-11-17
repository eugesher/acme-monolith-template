import type {
  IAuthCustomerRegisterLedgerPayload,
  IAuthCustomerRegisterLoggerPayload,
  IAuthCustomerRegisterReconstitute,
  IAuthCustomerRegisterSnapshot,
} from '../interfaces';

export class AuthCustomerRegisterModel {
  private constructor(
    private readonly id: string,
    private readonly email: string,
  ) {}

  public static reconstitute(record: IAuthCustomerRegisterReconstitute): AuthCustomerRegisterModel {
    const { id, email } = record;

    return new AuthCustomerRegisterModel(id, email);
  }

  public toSnapshot(): IAuthCustomerRegisterSnapshot {
    return { id: this.id, email: this.email };
  }

  public toLedgerPayload(): IAuthCustomerRegisterLedgerPayload {
    return { subjectId: this.id };
  }

  public toLoggerPayload(): IAuthCustomerRegisterLoggerPayload {
    return { id: this.id };
  }
}
