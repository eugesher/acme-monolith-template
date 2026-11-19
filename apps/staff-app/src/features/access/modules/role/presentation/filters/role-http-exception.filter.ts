import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';

import { RoleBaseException } from '../../domain';

@Catch(RoleBaseException)
export class RoleHttpExceptionFilter implements ExceptionFilter<RoleBaseException> {
  public static readonly STATUS: Record<RoleBaseException['code'], HttpStatus> = {
    [IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [IdentityExceptionCodeEnum.AUTH_ROLE_NAME_TAKEN]: HttpStatus.CONFLICT,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: RoleBaseException, host: ArgumentsHost): void {
    const statusCode = RoleHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
