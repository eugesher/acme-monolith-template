import type { Maybe } from '@acme-libs/toolkit';

import { NoteExceptionCodeEnum } from '../codes/note-exception-code.enum';
import { NoteBaseException } from './base/note-base.exception';

export class NoteVersionMismatchException extends NoteBaseException {
  public readonly code = NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH;

  constructor(
    noteId: string,
    expectedVersion: Maybe<number>,
    currentVersion: number,
    message = `Note ${noteId}: If-Match version ${String(expectedVersion)} does not match the current version ${currentVersion}`,
  ) {
    super(message, { currentVersion });
  }
}
