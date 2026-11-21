import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';

import { RoleBaseException } from '../../domain';

@Catch(RoleBaseException)
export class RoleHttpExceptionFilter extends DomainHttpExceptionFilter<RoleBaseException> {
  public static readonly STATUS: Record<RoleBaseException['code'], HttpStatus> = {
    [IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [IdentityExceptionCodeEnum.AUTH_ROLE_NAME_TAKEN]: HttpStatus.CONFLICT,
  };

  protected override readonly status = RoleHttpExceptionFilter.STATUS;
}
