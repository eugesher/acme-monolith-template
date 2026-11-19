import { HttpException, type HttpStatus } from '@nestjs/common';

import type { DomainException } from '@acme-libs/domain';

export class DomainHttpExceptionHelper {
  public static toHttpException(exception: DomainException, statusCode: HttpStatus): HttpException {
    const { code, message, details } = exception;

    return new HttpException({ statusCode, code, message, details }, statusCode);
  }
}
