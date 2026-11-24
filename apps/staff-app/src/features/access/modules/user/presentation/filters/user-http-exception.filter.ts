import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';

import { UserBaseException } from '../../domain';

@Catch(UserBaseException)
export class UserHttpExceptionFilter extends DomainHttpExceptionFilter<UserBaseException> {
  public static readonly STATUS: Record<UserBaseException['code'], HttpStatus> = {
    [IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID]: HttpStatus.BAD_REQUEST,
    [IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK]: HttpStatus.BAD_REQUEST,
    [IdentityExceptionCodeEnum.AUTH_USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN]: HttpStatus.CONFLICT,
    [IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  protected readonly status = UserHttpExceptionFilter.STATUS;
}
