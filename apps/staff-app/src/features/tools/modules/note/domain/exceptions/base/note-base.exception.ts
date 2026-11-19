import { DomainException } from '@acme-libs/domain';

import type { NoteExceptionCodeEnum } from '../../enums/note-exception-code.enum';

export abstract class NoteBaseException extends DomainException {
  public abstract override readonly code: NoteExceptionCodeEnum;
}
