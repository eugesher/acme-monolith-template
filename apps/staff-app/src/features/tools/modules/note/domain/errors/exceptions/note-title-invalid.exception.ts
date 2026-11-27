import { NoteExceptionCodeEnum } from '../codes/note-exception-code.enum';
import { NoteBaseException } from './base/note-base.exception';

export class NoteTitleInvalidException extends NoteBaseException {
  public readonly code = NoteExceptionCodeEnum.NOTE_TITLE_INVALID;

  constructor(
    maxLength: number,
    message = `Note.title must be a non-empty string of at most ${maxLength} characters`,
  ) {
    super(message);
  }
}
