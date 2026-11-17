import { ProductAggregate } from '../aggregates/product.aggregate';
import { ProductUpdatedEvent } from '../events/product-updated.event';
import type {
  IProductReconstitute,
  IProductUpdate,
  IProductUpdateLoggerPayload,
} from '../interfaces';

export class ProductUpdateModel extends ProductAggregate {
  public static reconstitute(this: void, record: IProductReconstitute): ProductUpdateModel {
    return new ProductUpdateModel(record);
  }

  public update(changes: IProductUpdate): void {
    const { name } = changes;

    if (name === undefined) {
      return;
    }

    const validName = ProductUpdateModel.validName(name);

    if (validName === this.currentName) {
      return;
    }

    const previousName = this.currentName;

    this.currentName = validName;
    this.currentVersion += 1;

    const updatedEvent = new ProductUpdatedEvent(
      this.id,
      { name: validName },
      { name: previousName },
    );

    this.addDomainEvent(updatedEvent);
  }

  public toLoggerPayload(): IProductUpdateLoggerPayload {
    return { id: this.id, version: this.currentVersion };
  }
}
