import {
  OrderEmptyException,
  OrderProductNotFoundException,
  OrderStockInsufficientException,
} from '../errors';
import type {
  IOrderCandidateActiveProduct,
  IOrderCandidateCreate,
  IOrderCandidateInsertPayload,
  IOrderCandidateOrderProduct,
  IOrderCandidateStockQuantity,
} from '../interfaces';

export class OrderCandidateModel {
  public get distinctProductIds(): readonly string[] {
    return this._distinctProductIds;
  }

  private constructor(
    private readonly customerId: string,
    private readonly productIds: readonly string[],
    private readonly _distinctProductIds: readonly string[],
  ) {}

  public static create(proposal: IOrderCandidateCreate): OrderCandidateModel {
    const { customerId, productIds } = proposal;
    const distinctProductIds = [...new Set(productIds)];

    return new OrderCandidateModel(customerId, productIds, distinctProductIds);
  }

  public validate(): void {
    if (this.productIds.length === 0) {
      throw new OrderEmptyException();
    }
  }

  public assertProducts(activeProducts: IOrderCandidateActiveProduct[]): void {
    for (const productId of this.productIds) {
      const isProductFound = activeProducts.some((product) => product.id === productId);

      if (!isProductFound) {
        throw new OrderProductNotFoundException(productId);
      }
    }
  }

  public assertStockQuantities(stockQuantities: IOrderCandidateStockQuantity[]): void {
    for (const productId of this._distinctProductIds) {
      const requestedQuantity = this.productIds.filter((id) => id === productId).length;
      const productStock = stockQuantities.find((candidate) => candidate.productId === productId);
      const available = productStock?.quantity ?? 0;

      if (requestedQuantity > available) {
        throw new OrderStockInsufficientException(productId, requestedQuantity, available);
      }
    }
  }

  public toInsertPayload(): IOrderCandidateInsertPayload {
    return { customerId: this.customerId };
  }

  public createOrderProducts(orderId: string): IOrderCandidateOrderProduct[] {
    return this.productIds.map((productId) => ({ orderId, productId }));
  }
}
