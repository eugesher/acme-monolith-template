import type { IOrderCandidateInitProductStock } from './order-candidate-init-product-stock.interface';
import type { IOrderCandidateInitProduct } from './order-candidate-init-product.interface';

export interface IOrderCandidateInit {
  customerId: string;
  productIds: string[];
  products: IOrderCandidateInitProduct[];
  stockOnHand: IOrderCandidateInitProductStock[];
}
