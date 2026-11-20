import { DomainException } from '@acme-libs/domain';

import type { QueueExceptionCodeEnum } from '../../codes/queue-exception-code.enum';

export abstract class QueueBaseException extends DomainException {
  public abstract override readonly code: QueueExceptionCodeEnum;
}
