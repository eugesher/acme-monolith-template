import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';

import { AuthBaseException } from '../../domain';

@Catch(AuthBaseException)
export class AuthHttpExceptionFilter extends DomainHttpExceptionFilter<AuthBaseException> {
  public static readonly STATUS: Record<AuthBaseException['code'], HttpStatus> = {
    [IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID]: HttpStatus.BAD_REQUEST,
    [IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK]: HttpStatus.BAD_REQUEST,
    [IdentityExceptionCodeEnum.AUTH_INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
    [IdentityExceptionCodeEnum.AUTH_USER_INACTIVE]: HttpStatus.FORBIDDEN,
    [IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN]: HttpStatus.CONFLICT,
  };

  protected override readonly status = AuthHttpExceptionFilter.STATUS;
}
