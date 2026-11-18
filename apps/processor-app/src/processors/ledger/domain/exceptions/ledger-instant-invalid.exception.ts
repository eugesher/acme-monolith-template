import { LedgerExceptionCodeEnum } from '../enums/ledger-exception-code.enum';
import { LedgerBaseException } from './base/ledger-base.exception';

export class LedgerInstantInvalidException extends LedgerBaseException {
  public readonly code = LedgerExceptionCodeEnum.LEDGER_INSTANT_INVALID;

  constructor(occurredAt: string, message = `occurredAt is not a valid instant: ${occurredAt}`) {
    super(message);
  }
}
