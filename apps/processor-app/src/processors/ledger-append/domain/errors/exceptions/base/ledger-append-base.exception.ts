import { DomainException } from '@acme-libs/domain';

import type { LedgerAppendExceptionCodeEnum } from '../../codes/ledger-append-exception-code.enum';

export abstract class LedgerAppendBaseException extends DomainException {
  public abstract override readonly code: LedgerAppendExceptionCodeEnum;
}
