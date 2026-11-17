import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductAggregate } from '../aggregates/product.aggregate';
import { ProductPublishedEvent } from '../events/product-published.event';
import type { IProductPublishLoggerPayload, IProductReconstitute } from '../interfaces';

export class ProductPublishModel extends ProductAggregate {
  public static reconstitute(this: void, record: IProductReconstitute): ProductPublishModel {
    return new ProductPublishModel(record);
  }

  public publish(): void {
    if (this.currentStatus === ProductStatusEnum.ACTIVE) {
      return;
    }

    const previousStatus = this.currentStatus;

    this.currentStatus = ProductStatusEnum.ACTIVE;
    this.currentVersion += 1;

    const publishedEvent = new ProductPublishedEvent(
      this.id,
      this.sku,
      this.currentVersion,
      previousStatus,
    );

    this.addDomainEvent(publishedEvent);
  }

  public toLoggerPayload(): IProductPublishLoggerPayload {
    return { id: this.id };
  }
}
