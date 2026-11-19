import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { ProductStockBaseException, ProductStockExceptionCodeEnum } from '../../domain';

@Catch(ProductStockBaseException)
export class ProductStockHttpExceptionFilter implements ExceptionFilter<ProductStockBaseException> {
  public static readonly STATUS: Record<ProductStockBaseException['code'], HttpStatus> = {
    [ProductStockExceptionCodeEnum.PRODUCT_QUANTITY_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductStockExceptionCodeEnum.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ProductStockExceptionCodeEnum.PRODUCT_IDEMPOTENT_REQUEST_IN_FLIGHT]: HttpStatus.CONFLICT,
    [ProductStockExceptionCodeEnum.PRODUCT_IDEMPOTENCY_KEY_REUSED]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: ProductStockBaseException, host: ArgumentsHost): void {
    const statusCode = ProductStockHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
