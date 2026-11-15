export interface IOrderProductSnapshot {
  readonly id: string;
  readonly productId: string;
  readonly product: {
    readonly sku: string;
    readonly name: string;
  };
}
