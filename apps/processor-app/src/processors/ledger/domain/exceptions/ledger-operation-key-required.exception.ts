import { LedgerExceptionCodeEnum } from '../enums/ledger-exception-code.enum';
import { LedgerBaseException } from './base/ledger-base.exception';

export class LedgerOperationKeyRequiredException extends LedgerBaseException {
  public readonly code = LedgerExceptionCodeEnum.LEDGER_OPERATION_KEY_REQUIRED;

  constructor(message = 'LedgerEntry.operationKey is required') {
    super(message);
  }
}
