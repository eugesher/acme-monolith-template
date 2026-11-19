import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { OrderBaseException, OrderExceptionCodeEnum } from '../../domain';

@Catch(OrderBaseException)
export class OrderHttpExceptionFilter implements ExceptionFilter<OrderBaseException> {
  public static readonly STATUS: Record<OrderBaseException['code'], HttpStatus> = {
    [OrderExceptionCodeEnum.ORDER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [OrderExceptionCodeEnum.ORDER_TAG_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: OrderBaseException, host: ArgumentsHost): void {
    const statusCode = OrderHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
