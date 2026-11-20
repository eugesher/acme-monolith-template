import { DomainException } from '@acme-libs/domain';

import type { TagExceptionCodeEnum } from '../../codes/tag-exception-code.enum';

export abstract class TagBaseException extends DomainException {
  public abstract override readonly code: TagExceptionCodeEnum;
}
