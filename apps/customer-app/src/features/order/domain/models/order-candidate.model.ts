import { OrderEmptyException } from '../exceptions/order-empty.exception';
import { OrderProductNotFoundException } from '../exceptions/order-product-not-found.exception';
import { OrderStockInsufficientException } from '../exceptions/order-stock-insufficient.exception';
import type {
  IOrderCandidateActiveProduct,
  IOrderCandidateCreate,
  IOrderCandidateInsertPayload,
  IOrderCandidateOrderProduct,
  IOrderCandidateStockQuantity,
} from '../interfaces';

export class OrderCandidateModel {
  public get distinctProductIds(): string[] {
    return [...new Set(this.productIds)];
  }

  private constructor(
    private readonly customerId: string,
    private readonly productIds: readonly string[],
  ) {}

  public static create(proposal: IOrderCandidateCreate): OrderCandidateModel {
    const { customerId, productIds } = proposal;

    return new OrderCandidateModel(customerId, productIds);
  }

  public toInsertPayload(): IOrderCandidateInsertPayload {
    return { customerId: this.customerId };
  }

  public createOrderProducts(orderId: string): IOrderCandidateOrderProduct[] {
    return this.productIds.map((productId) => ({ orderId, productId }));
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
    for (const productId of this.distinctProductIds) {
      const requestedQuantity = this.productIds.filter((id) => id === productId).length;
      const productStock = stockQuantities.find((candidate) => candidate.productId === productId);
      const available = productStock?.quantity ?? 0;

      if (requestedQuantity > available) {
        throw new OrderStockInsufficientException(productId, requestedQuantity, available);
      }
    }
  }
}
