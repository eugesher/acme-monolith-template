import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { QueueBaseException, QueueExceptionCodeEnum } from '../../domain';

@Catch(QueueBaseException)
export class QueueHttpExceptionFilter implements ExceptionFilter<QueueBaseException> {
  public static readonly STATUS: Record<QueueBaseException['code'], HttpStatus> = {
    [QueueExceptionCodeEnum.QUEUE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED]: HttpStatus.CONFLICT,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: QueueBaseException, host: ArgumentsHost): void {
    const statusCode = QueueHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
