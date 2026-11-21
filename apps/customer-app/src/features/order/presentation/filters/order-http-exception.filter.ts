import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { OrderBaseException, OrderExceptionCodeEnum } from '../../domain';

@Catch(OrderBaseException)
export class OrderHttpExceptionFilter extends DomainHttpExceptionFilter<OrderBaseException> {
  public static readonly STATUS: Record<OrderBaseException['code'], HttpStatus> = {
    [OrderExceptionCodeEnum.ORDER_EMPTY]: HttpStatus.BAD_REQUEST,
    [OrderExceptionCodeEnum.ORDER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [OrderExceptionCodeEnum.ORDER_STOCK_INSUFFICIENT]: HttpStatus.CONFLICT,
    [OrderExceptionCodeEnum.ORDER_IDEMPOTENT_REQUEST_IN_FLIGHT]: HttpStatus.CONFLICT,
    [OrderExceptionCodeEnum.ORDER_IDEMPOTENCY_KEY_REUSED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [OrderExceptionCodeEnum.ORDER_PRODUCT_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  protected override readonly status = OrderHttpExceptionFilter.STATUS;
}
