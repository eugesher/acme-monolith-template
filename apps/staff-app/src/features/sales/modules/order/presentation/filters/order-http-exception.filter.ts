import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { OrderBaseException, OrderExceptionCodeEnum } from '../../domain';

@Catch(OrderBaseException)
export class OrderHttpExceptionFilter extends DomainHttpExceptionFilter<OrderBaseException> {
  public static readonly STATUS: Record<OrderBaseException['code'], HttpStatus> = {
    [OrderExceptionCodeEnum.ORDER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [OrderExceptionCodeEnum.ORDER_TAG_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  protected readonly status = OrderHttpExceptionFilter.STATUS;
}
