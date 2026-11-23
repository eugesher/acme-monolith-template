import type { IOrderReconstitute } from './order-reconstitute.interface';

export interface IOrderPlaceReconstitute extends IOrderReconstitute {
  customerId: string;
}
