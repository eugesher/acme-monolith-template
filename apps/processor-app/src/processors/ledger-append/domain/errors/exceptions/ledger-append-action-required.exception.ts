import { LedgerAppendExceptionCodeEnum } from '../codes/ledger-append-exception-code.enum';
import { LedgerAppendBaseException } from './base/ledger-append-base.exception';

export class LedgerAppendActionRequiredException extends LedgerAppendBaseException {
  public readonly code = LedgerAppendExceptionCodeEnum.LEDGER_APPEND_ACTION_REQUIRED;

  constructor(message = 'LedgerEntry.action is required') {
    super(message);
  }
}
