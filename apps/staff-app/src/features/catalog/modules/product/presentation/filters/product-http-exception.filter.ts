import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';

import { DomainHttpExceptionHelper, HttpExceptionFilter } from '@acme-libs/http';

import { ProductBaseException, ProductExceptionCodeEnum } from '../../domain';

@Catch(ProductBaseException)
export class ProductHttpExceptionFilter implements ExceptionFilter<ProductBaseException> {
  public static readonly STATUS: Record<ProductBaseException['code'], HttpStatus> = {
    [ProductExceptionCodeEnum.PRODUCT_SKU_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductExceptionCodeEnum.PRODUCT_NAME_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductExceptionCodeEnum.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ProductExceptionCodeEnum.PRODUCT_ALREADY_ARCHIVED]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_SKU_TAKEN]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_TAG_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ProductExceptionCodeEnum.PRODUCT_VERSION_INVALID]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  constructor(private readonly httpExceptionFilter: HttpExceptionFilter) {}

  public catch(exception: ProductBaseException, host: ArgumentsHost): void {
    const statusCode = ProductHttpExceptionFilter.STATUS[exception.code];
    const error = DomainHttpExceptionHelper.toHttpException(exception, statusCode);

    this.httpExceptionFilter.catch(error, host);
  }
}
