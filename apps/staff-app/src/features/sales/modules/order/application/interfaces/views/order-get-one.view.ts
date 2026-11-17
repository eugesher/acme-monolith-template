export interface IOrderGetOneView {
  id: string;
  customerId: string;
  createdAt: string;
  orderProducts: {
    id: string;
    product: {
      id: string;
      sku: string;
      name: string;
    };
  }[];
}
