import { Entity } from '@acme-libs/domain';

import { ProductStockQuantityInvalidException } from '../errors';
import type {
  IProductStockAddLedgerPayload,
  IProductStockAddLedgerPayloadBuild,
  IProductStockAddLoggerPayload,
  IProductStockAddLoggerPayloadBuild,
  IProductStockAddReconstitute,
  IProductStockOnHandSnapshot,
} from '../types';

export class ProductStockAddModel extends Entity {
  private static readonly ADD_MAX_QUANTITY = 100_000;

  private addedQuantity = 0;

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
    this.addedQuantity = ProductStockAddModel.validQuantity(quantity);
  }

  public toOnHandSnapshot(quantity: number): IProductStockOnHandSnapshot {
    return { productId: this.id, quantity };
  }

  public toLedgerPayload(
    params: IProductStockAddLedgerPayloadBuild,
  ): IProductStockAddLedgerPayload {
    const { productStockId, createdAt } = params;

    return {
      productStockId,
      subjectId: this.id,
      occurredAt: createdAt,
      payload: { sku: this.sku, quantity: this.addedQuantity },
    };
  }

  private static validQuantity(quantity: number): number {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > ProductStockAddModel.ADD_MAX_QUANTITY
    ) {
      throw new ProductStockQuantityInvalidException(
        ProductStockAddModel.ADD_MAX_QUANTITY,
        quantity,
      );
    }

    return quantity;
  }
}
