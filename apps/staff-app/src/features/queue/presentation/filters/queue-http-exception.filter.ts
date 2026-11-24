import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { QueueBaseException, QueueExceptionCodeEnum } from '../../domain';

@Catch(QueueBaseException)
export class QueueHttpExceptionFilter extends DomainHttpExceptionFilter<QueueBaseException> {
  public static readonly STATUS: Record<QueueBaseException['code'], HttpStatus> = {
    [QueueExceptionCodeEnum.QUEUE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED]: HttpStatus.CONFLICT,
  };

  protected readonly status = QueueHttpExceptionFilter.STATUS;
}
