import { ValueObject } from '@acme-libs/domain';

export class ReminderDueOnValue extends ValueObject<{ isoDate: string }> {
  public get isoDate(): string {
    return this.props.isoDate;
  }

  private static readonly PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  public static create(dueOn: string): ReminderDueOnValue {
    return new ReminderDueOnValue({ isoDate: dueOn });
  }

  public isFormatted(): boolean {
    return ReminderDueOnValue.PATTERN.test(this.props.isoDate);
  }

  public isCalendarDate(): boolean {
    const { isoDate } = this.props;
    const parsedDate = new Date(`${isoDate}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === isoDate;
  }
}
