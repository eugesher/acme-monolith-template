import { LedgerExceptionCodeEnum } from '../codes/ledger-exception-code.enum';
import { LedgerBaseException } from './base/ledger-base.exception';

export class LedgerActionRequiredException extends LedgerBaseException {
  public readonly code = LedgerExceptionCodeEnum.LEDGER_ACTION_REQUIRED;

  constructor(message = 'LedgerEntry.action is required') {
    super(message);
  }
}
