import type { IProductStockAddLedgerPayload } from '../../../domain';
import type { IProductStockAddView } from './product-stock-add.view';

export interface IProductStockAddWriteView {
  stockOnHand: IProductStockAddView;
  productStockId: string;
  productStockLedgerPayload: IProductStockAddLedgerPayload;
}
