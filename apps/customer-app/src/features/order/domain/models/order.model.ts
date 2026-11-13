import { AggregateRootBase } from '@acme-libs/toolkit';

import { OrderEmptyException } from '../exceptions/order-empty.exception';
import { OrderProductNotFoundException } from '../exceptions/order-product-not-found.exception';
import { OrderStockInsufficientException } from '../exceptions/order-stock-insufficient.exception';
import type {
  IOrderCandidate,
  IOrderCandidateInit,
  IOrderCandidateInitProduct,
  IOrderCandidateInitProductStock,
  IOrderProductSnapshot,
  IOrderProductStockMovement,
  IOrderReconstitute,
  IOrderSnapshot,
} from '../interfaces';

export class OrderModel extends AggregateRootBase<string> {
  private constructor(
    id: string,
    public readonly products: readonly IOrderProductSnapshot[],
    public readonly createdAt: Date,
  ) {
    super(id);
  }

  public static reconstitute(record: IOrderReconstitute): OrderModel {
    const { id, createdAt, orderProducts } = record;
    const products = orderProducts.map((orderProduct) => ({
      id: orderProduct.id,
      productId: orderProduct.productId,
      sku: orderProduct.product.sku,
      name: orderProduct.product.name,
    }));

    return new OrderModel(id, products, createdAt);
  }

  public static initCandidate(proposal: IOrderCandidateInit): IOrderCandidate {
    const { customerId, productIds, products, stockOnHand } = proposal;

    if (productIds.length === 0) {
      throw new OrderEmptyException();
    }

    OrderModel.assertFound(productIds, products);
    OrderModel.assertInStock(productIds, stockOnHand);

    return { customerId, productIds: [...productIds] };
  }

  public getProductStockMovements(): IOrderProductStockMovement[] {
    return this.products.map((product) => ({
      productId: product.productId,
      orderProductId: product.id,
    }));
  }

  public toSnapshot(): IOrderSnapshot {
    const products = this.products.map((product) => ({
      id: product.id,
      productId: product.productId,
      sku: product.sku,
      name: product.name,
    }));

    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      products,
    };
  }

  private static assertFound(productIds: string[], products: IOrderCandidateInitProduct[]): void {
    for (const productId of productIds) {
      const isProductFound = products.some((product) => product.id === productId);

      if (!isProductFound) {
        throw new OrderProductNotFoundException(productId);
      }
    }
  }

  private static assertInStock(
    productIds: string[],
    stockOnHand: IOrderCandidateInitProductStock[],
  ): void {
    const distinctIds = new Set(productIds);

    for (const productId of distinctIds) {
      const requestedQuantity = productIds.filter((id) => id === productId).length;
      const productStock = stockOnHand.find((candidate) => candidate.productId === productId);
      const available = productStock?.quantity ?? 0;

      if (requestedQuantity > available) {
        throw new OrderStockInsufficientException(productId, requestedQuantity, available);
      }
    }
  }
}
