import { DomainException } from '@acme-libs/domain';

import type { ProductExceptionCodeEnum } from '../../enums/product-exception-code.enum';

export abstract class ProductBaseException extends DomainException {
  public abstract override readonly code: ProductExceptionCodeEnum;
}
