import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { OrderBaseException, OrderExceptionCodeEnum } from '../../domain';

@Catch(OrderBaseException)
export class OrderHttpExceptionFilter implements ExceptionFilter<OrderBaseException> {
  public static readonly STATUS: Record<OrderBaseException['code'], HttpStatus> = {
    [OrderExceptionCodeEnum.ORDER_EMPTY]: HttpStatus.BAD_REQUEST,
    [OrderExceptionCodeEnum.ORDER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [OrderExceptionCodeEnum.ORDER_STOCK_INSUFFICIENT]: HttpStatus.CONFLICT,
    [OrderExceptionCodeEnum.ORDER_IDEMPOTENT_REQUEST_IN_FLIGHT]: HttpStatus.CONFLICT,
    [OrderExceptionCodeEnum.ORDER_IDEMPOTENCY_KEY_REUSED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [OrderExceptionCodeEnum.ORDER_PRODUCT_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: OrderBaseException, host: ArgumentsHost): void {
    const statusCode = OrderHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
