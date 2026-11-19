import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { NoteBaseException, NoteExceptionCodeEnum } from '../../domain';

@Catch(NoteBaseException)
export class NoteHttpExceptionFilter implements ExceptionFilter<NoteBaseException> {
  public static readonly STATUS: Record<NoteBaseException['code'], HttpStatus> = {
    [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID]: HttpStatus.BAD_REQUEST,
    [NoteExceptionCodeEnum.NOTE_BODY_INVALID]: HttpStatus.BAD_REQUEST,
    [NoteExceptionCodeEnum.NOTE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [NoteExceptionCodeEnum.NOTE_RESOLVED]: HttpStatus.CONFLICT,
    [NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT]: HttpStatus.CONFLICT,
    [NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH]: HttpStatus.PRECONDITION_FAILED,
    [NoteExceptionCodeEnum.NOTE_VERSION_INVALID]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: NoteBaseException, host: ArgumentsHost): void {
    const statusCode = NoteHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
