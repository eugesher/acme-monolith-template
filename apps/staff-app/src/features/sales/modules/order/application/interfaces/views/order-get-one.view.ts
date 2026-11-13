export interface IOrderGetOneView {
  id: string;
  customerId: string;
  createdAt: string;
  orderProducts: {
    id: string;
    productId: string;
    product: {
      sku: string;
      name: string;
    };
  }[];
}
