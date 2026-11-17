export interface IOrderReconstitute {
  id: string;
  createdAt: Date;
  orderProducts: {
    id: string;
    product: {
      id: string;
      sku: string;
      name: string;
    };
  }[];
}
