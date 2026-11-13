export interface IOrderProductView {
  id: string;
  productId: string;
  product: {
    sku: string;
    name: string;
  };
}
