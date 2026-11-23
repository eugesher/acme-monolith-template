export interface IOrderProductSnapshot {
  readonly id: string;
  readonly product: {
    readonly id: string;
    readonly sku: string;
    readonly name: string;
  };
}
