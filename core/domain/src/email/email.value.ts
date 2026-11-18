import { ValueObject } from '@acme-libs/domain';

export class EmailValue extends ValueObject<{ address: string }> {
  public get address(): string {
    return this.props.address;
  }

  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static create(email: string): EmailValue {
    return new EmailValue({ address: email.trim().toLowerCase() });
  }

  public isValid(): boolean {
    return EmailValue.PATTERN.test(this.props.address);
  }
}
