import type {
  IProductStockCoreMovementsCreate,
  IProductStockCoreMovementsInsertedRow,
  IProductStockCoreMovementsInsertQuery,
  IProductStockCoreMovementsPostSubtractLoggerPayload,
} from '../interfaces';

export class ProductStockCoreMovementsModel {
  public get distinctProductIds(): string[] {
    const productIds = this.movements.map((movement) => movement.productId);

    return [...new Set(productIds)];
  }

  public get distinctProducts(): { id: string }[] {
    return this.distinctProductIds.map((id) => ({ id }));
  }

  private constructor(
    private readonly sign: number,
    private readonly movements: IProductStockCoreMovementsCreate['movements'],
  ) {}

  public static create(proposal: IProductStockCoreMovementsCreate): ProductStockCoreMovementsModel {
    const { sign, movements } = proposal;

    return new ProductStockCoreMovementsModel(sign, movements);
  }

  public static toProductStockIds(rows: IProductStockCoreMovementsInsertedRow[]): string[] {
    return rows.map((row) => String(row.id));
  }

  public toInsertQueries(): IProductStockCoreMovementsInsertQuery[] {
    return this.movements.map((movement) => ({
      productId: movement.productId,
      quantity: this.sign * movement.quantity,
      orderProductId: movement.orderProductId,
    }));
  }

  public toPostSubtractLoggerPayload(): IProductStockCoreMovementsPostSubtractLoggerPayload {
    return { products: this.distinctProducts };
  }
}
