import { ProductStatusEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import { ProductAggregate } from '../aggregates/product.aggregate';
import type {
  IProductPublishLedgerPayload,
  IProductPublishLoggerPayload,
  IProductReconstitute,
} from '../interfaces';

export class ProductPublishModel extends ProductAggregate {
  public static reconstitute(this: void, record: IProductReconstitute): ProductPublishModel {
    return new ProductPublishModel(record);
  }

  public publish(): Maybe<ProductStatusEnum> {
    if (this.status === ProductStatusEnum.ACTIVE) {
      return undefined;
    }

    const previousStatus = this.status;

    this.status = ProductStatusEnum.ACTIVE;
    this.bumpVersion();

    return previousStatus;
  }

  public toLedgerPayload(previousStatus: ProductStatusEnum): IProductPublishLedgerPayload {
    return {
      subjectId: this.id,
      version: this.version,
      occurredAt: this.updatedAt.toISOString(),
      payload: { sku: this.sku, previousStatus },
    };
  }

  public toLoggerPayload(): IProductPublishLoggerPayload {
    return { id: this.id };
  }
}
