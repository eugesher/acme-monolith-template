import { AggregateRoot } from '@acme-libs/domain';

import { ProductStockAddedEvent } from '../events/product-stock-added.event';
import { ProductQuantityInvalidException } from '../exceptions/product-quantity-invalid.exception';
import type {
  IProductStockAddLoggerPayload,
  IProductStockAddLoggerPayloadBuild,
  IProductStockAddReconstitute,
  IProductStockOnHandSnapshot,
} from '../interfaces';

export class ProductStockAddModel extends AggregateRoot {
  private static readonly ADD_MAX_QUANTITY = 100_000;

  private constructor(
    productId: string,
    private readonly sku: string,
  ) {
    super(productId);
  }

  public static reconstitute(record: IProductStockAddReconstitute): ProductStockAddModel {
    const { id, sku } = record;

    return new ProductStockAddModel(id, sku);
  }

  public static toLoggerPayload(
    params: IProductStockAddLoggerPayloadBuild,
  ): IProductStockAddLoggerPayload {
    const { productStockId, productId, quantity } = params;

    return { id: productStockId, productId, quantity };
  }

  public add(quantity: number): void {
    const validQuantity = ProductStockAddModel.validQuantity(quantity);
    const addedEvent = new ProductStockAddedEvent(this.id, this.sku, validQuantity);

    this.addDomainEvent(addedEvent);
  }

  public toOnHandSnapshot(quantity: number): IProductStockOnHandSnapshot {
    return { productId: this.id, quantity };
  }

  private static validQuantity(quantity: number): number {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > ProductStockAddModel.ADD_MAX_QUANTITY
    ) {
      throw new ProductQuantityInvalidException(ProductStockAddModel.ADD_MAX_QUANTITY, quantity);
    }

    return quantity;
  }
}
