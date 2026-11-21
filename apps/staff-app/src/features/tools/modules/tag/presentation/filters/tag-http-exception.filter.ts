import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { TagBaseException, TagExceptionCodeEnum } from '../../domain';

@Catch(TagBaseException)
export class TagHttpExceptionFilter extends DomainHttpExceptionFilter<TagBaseException> {
  public static readonly STATUS: Record<TagBaseException['code'], HttpStatus> = {
    [TagExceptionCodeEnum.TAG_NAME_INVALID]: HttpStatus.BAD_REQUEST,
    [TagExceptionCodeEnum.TAG_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [TagExceptionCodeEnum.TAG_NAME_TAKEN]: HttpStatus.CONFLICT,
  };

  protected override readonly status = TagHttpExceptionFilter.STATUS;
}
