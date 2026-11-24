import { Catch, HttpStatus } from '@nestjs/common';

import { DomainHttpExceptionFilter } from '@acme-libs/http';

import { ProductBaseException, ProductExceptionCodeEnum } from '../../domain';

@Catch(ProductBaseException)
export class ProductHttpExceptionFilter extends DomainHttpExceptionFilter<ProductBaseException> {
  public static readonly STATUS: Record<ProductBaseException['code'], HttpStatus> = {
    [ProductExceptionCodeEnum.PRODUCT_SKU_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductExceptionCodeEnum.PRODUCT_NAME_INVALID]: HttpStatus.BAD_REQUEST,
    [ProductExceptionCodeEnum.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ProductExceptionCodeEnum.PRODUCT_ALREADY_ARCHIVED]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_SKU_TAKEN]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_VERSION_CONFLICT]: HttpStatus.CONFLICT,
    [ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH]: HttpStatus.PRECONDITION_FAILED,
    [ProductExceptionCodeEnum.PRODUCT_TAG_NOT_FOUND]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ProductExceptionCodeEnum.PRODUCT_VERSION_INVALID]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  protected readonly status = ProductHttpExceptionFilter.STATUS;
}
