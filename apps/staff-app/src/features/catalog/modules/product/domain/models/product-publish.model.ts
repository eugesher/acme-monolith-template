import { ProductStatusEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import { ProductAggregate } from '../aggregates/product.aggregate';
import type {
  IProductPublishLedgerPayload,
  IProductPublishLoggerPayload,
  IProductReconstitute,
} from '../interfaces';

export class ProductPublishModel extends ProductAggregate {
  private previousStatus: Maybe<ProductStatusEnum>;

  public static reconstitute(this: void, record: IProductReconstitute): ProductPublishModel {
    return new ProductPublishModel(record);
  }

  public publish(): void {
    if (this.currentStatus === ProductStatusEnum.ACTIVE) {
      return;
    }

    this.previousStatus = this.currentStatus;
    this.currentStatus = ProductStatusEnum.ACTIVE;
    this.currentVersion += 1;
  }

  public toLedgerPayload(): Maybe<IProductPublishLedgerPayload> {
    if (this.previousStatus === undefined) {
      return undefined;
    }

    return {
      subjectId: this.id,
      version: this.currentVersion,
      payload: { sku: this.sku, previousStatus: this.previousStatus },
    };
  }

  public toLoggerPayload(): IProductPublishLoggerPayload {
    return { id: this.id };
  }
}
