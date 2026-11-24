import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { NoteBaseException, NoteExceptionCodeEnum } from '../../domain';

@Catch(NoteBaseException)
export class NoteHttpExceptionFilter extends DomainHttpExceptionFilter<NoteBaseException> {
  public static readonly STATUS: Record<NoteBaseException['code'], HttpStatus> = {
    [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID]: HttpStatus.BAD_REQUEST,
    [NoteExceptionCodeEnum.NOTE_BODY_INVALID]: HttpStatus.BAD_REQUEST,
    [NoteExceptionCodeEnum.NOTE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [NoteExceptionCodeEnum.NOTE_RESOLVED]: HttpStatus.CONFLICT,
    [NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT]: HttpStatus.CONFLICT,
    [NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH]: HttpStatus.PRECONDITION_FAILED,
    [NoteExceptionCodeEnum.NOTE_VERSION_INVALID]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  protected readonly status = NoteHttpExceptionFilter.STATUS;
}
