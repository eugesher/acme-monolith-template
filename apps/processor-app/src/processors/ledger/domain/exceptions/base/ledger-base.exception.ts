import { DomainException } from '@acme-libs/domain';

import type { LedgerExceptionCodeEnum } from '../../enums/ledger-exception-code.enum';

export abstract class LedgerBaseException extends DomainException {
  public abstract override readonly code: LedgerExceptionCodeEnum;
}
