export interface IOrderProductView {
  readonly id: string;
  readonly product: {
    readonly id: string;
    readonly sku: string;
    readonly name: string;
  };
}
