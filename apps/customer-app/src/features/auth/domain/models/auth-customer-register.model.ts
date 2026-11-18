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
    private readonly createdAt: Date,
  ) {}

  public static reconstitute(record: IAuthCustomerRegisterReconstitute): AuthCustomerRegisterModel {
    const { id, email, createdAt } = record;

    return new AuthCustomerRegisterModel(id, email, createdAt);
  }

  public toSnapshot(): IAuthCustomerRegisterSnapshot {
    return { id: this.id, email: this.email };
  }

  public toLedgerPayload(): IAuthCustomerRegisterLedgerPayload {
    return { subjectId: this.id, occurredAt: this.createdAt.toISOString() };
  }

  public toLoggerPayload(): IAuthCustomerRegisterLoggerPayload {
    return { id: this.id };
  }
}
