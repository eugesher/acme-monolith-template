import { HttpException, type ArgumentsHost, type HttpStatus } from '@nestjs/common';

import { DomainException } from '@acme-libs/domain';

import { HttpExceptionFilter } from './http-exception.filter';

export abstract class DomainHttpExceptionFilter<
  TException extends DomainException,
> extends HttpExceptionFilter {
  protected abstract readonly status: Readonly<Record<TException['code'], HttpStatus>>;

  public override catch(exception: unknown, host: ArgumentsHost): void {
    const answered = this.answer(exception);

    super.catch(answered, host);
  }

  private answer(exception: unknown): unknown {
    if (!(exception instanceof DomainException) || !Object.hasOwn(this.status, exception.code)) {
      return exception;
    }

    const statusCode = this.status[exception.code as TException['code']];
    const { code, message, details } = exception;

    return new HttpException({ statusCode, code, message, details }, statusCode);
  }
}
