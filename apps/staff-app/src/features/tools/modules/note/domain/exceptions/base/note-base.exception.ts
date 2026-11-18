import { DomainException } from '@acme-libs/domain';
import type { Maybe } from '@acme-libs/toolkit';

import type { NoteExceptionCodeEnum } from '../../enums/note-exception-code.enum';

export abstract class NoteBaseException extends DomainException {
  public abstract override readonly code: NoteExceptionCodeEnum;
  public readonly details: Maybe<Readonly<Record<string, unknown>>>;

  protected constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message);
    this.details = details;
  }
}
