import { LedgerAppendExceptionCodeEnum } from '../codes/ledger-append-exception-code.enum';
import { LedgerAppendBaseException } from './base/ledger-append-base.exception';

export class LedgerAppendInstantInvalidException extends LedgerAppendBaseException {
  public readonly code = LedgerAppendExceptionCodeEnum.LEDGER_APPEND_INSTANT_INVALID;

  constructor(occurredAt: string, message = `occurredAt is not a valid instant: ${occurredAt}`) {
    super(message);
  }
}
