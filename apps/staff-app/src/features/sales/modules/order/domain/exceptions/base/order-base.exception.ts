import { DomainException } from '@acme-libs/domain';

import type { OrderExceptionCodeEnum } from '../../enums/order-exception-code.enum';

export abstract class OrderBaseException extends DomainException {
  public abstract override readonly code: OrderExceptionCodeEnum;
}
