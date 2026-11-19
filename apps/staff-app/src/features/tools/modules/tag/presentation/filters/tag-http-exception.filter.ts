import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { TagBaseException, TagExceptionCodeEnum } from '../../domain';

@Catch(TagBaseException)
export class TagHttpExceptionFilter implements ExceptionFilter<TagBaseException> {
  public static readonly STATUS: Record<TagBaseException['code'], HttpStatus> = {
    [TagExceptionCodeEnum.TAG_NAME_INVALID]: HttpStatus.BAD_REQUEST,
    [TagExceptionCodeEnum.TAG_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [TagExceptionCodeEnum.TAG_NAME_TAKEN]: HttpStatus.CONFLICT,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: TagBaseException, host: ArgumentsHost): void {
    const statusCode = TagHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
