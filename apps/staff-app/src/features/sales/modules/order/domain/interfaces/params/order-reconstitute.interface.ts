export interface IOrderReconstitute {
  id: string;
  customerId: string;
  createdAt: Date;
  orderProducts: {
    id: string;
    product: { id: string; sku: string; name: string };
  }[];
}
