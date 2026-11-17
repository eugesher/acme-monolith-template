export interface IOrderGetOneView {
  readonly id: string;
  readonly customerId: string;
  readonly createdAt: string;
  readonly orderProducts: readonly {
    id: string;
    product: {
      id: string;
      sku: string;
      name: string;
    };
  }[];
}
