import { ProductExceptionCodeEnum } from '../codes/product-exception-code.enum';
import { ProductBaseException } from './base/product-base.exception';

export class ProductVersionConflictException extends ProductBaseException {
  public readonly code = ProductExceptionCodeEnum.PRODUCT_VERSION_CONFLICT;

  constructor(
    productId: string,
    attempts: number,
    currentVersion: number,
    message = `Product ${productId} write lost the optimistic race after ${attempts} attempts`,
  ) {
    super(message, { currentVersion });
  }
}
