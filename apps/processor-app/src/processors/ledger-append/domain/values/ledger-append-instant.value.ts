import { ValueObject } from '@acme-libs/domain';

export class LedgerAppendInstantValue extends ValueObject<{ text: string }> {
  private static readonly EXPLICIT_ZONE = /(?:Z|[+-]\d{2}:?\d{2})$/;

  public static create(instant: string): LedgerAppendInstantValue {
    return new LedgerAppendInstantValue({ text: instant });
  }

  public hasExplicitZone(): boolean {
    return LedgerAppendInstantValue.EXPLICIT_ZONE.test(this.props.text);
  }

  public isValid(): boolean {
    return !Number.isNaN(this.toDate().getTime());
  }

  public toDate(): Date {
    return new Date(this.props.text);
  }
}
