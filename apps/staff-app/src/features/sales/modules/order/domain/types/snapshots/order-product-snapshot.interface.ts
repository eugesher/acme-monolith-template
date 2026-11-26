export interface IOrderProductSnapshot {
  id: string;
  product: {
    id: string;
    sku: string;
    name: string;
  };
}
