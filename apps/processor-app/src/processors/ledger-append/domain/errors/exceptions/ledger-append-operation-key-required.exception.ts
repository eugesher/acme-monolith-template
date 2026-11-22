import { LedgerAppendExceptionCodeEnum } from '../codes/ledger-append-exception-code.enum';
import { LedgerAppendBaseException } from './base/ledger-append-base.exception';

export class LedgerAppendOperationKeyRequiredException extends LedgerAppendBaseException {
  public readonly code = LedgerAppendExceptionCodeEnum.LEDGER_APPEND_OPERATION_KEY_REQUIRED;

  constructor(message = 'LedgerEntry.operationKey is required') {
    super(message);
  }
}
