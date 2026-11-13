export interface IOrderProductSnapshot {
  id: string;
  productId: string;
  product: {
    sku: string;
    name: string;
  };
}
