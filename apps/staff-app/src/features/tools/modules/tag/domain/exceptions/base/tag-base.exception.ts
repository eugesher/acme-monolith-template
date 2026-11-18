import { DomainException } from '@acme-libs/domain';

import type { TagExceptionCodeEnum } from '../../enums/tag-exception-code.enum';

export abstract class TagBaseException extends DomainException {
  public abstract override readonly code: TagExceptionCodeEnum;
}
