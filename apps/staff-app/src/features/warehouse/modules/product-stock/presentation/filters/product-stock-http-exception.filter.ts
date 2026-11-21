import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { ProductStockBaseException, ProductStockExceptionCodeEnum } from '../../domain';

@Catch(ProductStockBaseException)
export class ProductStockHttpExceptionFilter extends DomainHttpExceptionFilter<ProductStockBaseException> {
  public static readonly STATUS: Record<ProductStockBaseException['code'], HttpStatus> = {
    [ProductStockExceptionCodeEnum.PRODUCT_QUANTITY_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductStockExceptionCodeEnum.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ProductStockExceptionCodeEnum.PRODUCT_IDEMPOTENT_REQUEST_IN_FLIGHT]: HttpStatus.CONFLICT,
    [ProductStockExceptionCodeEnum.PRODUCT_IDEMPOTENCY_KEY_REUSED]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  protected override readonly status = ProductStockHttpExceptionFilter.STATUS;
}
