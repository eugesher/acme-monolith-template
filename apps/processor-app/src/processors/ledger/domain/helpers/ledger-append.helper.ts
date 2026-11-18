import { LedgerInstantInvalidException } from '../exceptions/ledger-instant-invalid.exception';

export class LedgerAppendHelper {
  private static readonly EXPLICIT_ZONE = /(?:Z|[+-]\d{2}:?\d{2})$/;

  public static parseInstant(value: string, field: string): Date {
    if (!LedgerAppendHelper.EXPLICIT_ZONE.test(value)) {
      throw new LedgerInstantInvalidException(
        `${field} must be an ISO-8601 instant with an explicit timezone offset, got ${value}`,
      );
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new LedgerInstantInvalidException(`${field} is not a valid instant: ${value}`);
    }

    return parsedDate;
  }
}
