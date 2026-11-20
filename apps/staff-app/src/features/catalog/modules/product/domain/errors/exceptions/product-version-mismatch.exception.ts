import type { Maybe } from '@acme-libs/toolkit';

import { ProductExceptionCodeEnum } from '../codes/product-exception-code.enum';
import { ProductBaseException } from './base/product-base.exception';

export class ProductVersionMismatchException extends ProductBaseException {
  public readonly code = ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH;

  constructor(
    productId: string,
    expectedVersion: Maybe<number>,
    currentVersion: Maybe<number>,
    message = `Product ${productId}: If-Match version ${String(expectedVersion)} does not match the current version ${String(currentVersion)}`,
  ) {
    super(message, { currentVersion });
  }
}
