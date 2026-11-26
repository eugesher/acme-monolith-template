import type {
  IProductStockPostSubtractArchiveCommand,
  IProductStockPostSubtractArchiveView,
} from '../types';

export interface IProductStockPostSubtractArchivePort {
  archive(
    command: IProductStockPostSubtractArchiveCommand,
  ): Promise<IProductStockPostSubtractArchiveView>;
}

export const PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT = Symbol(
  'PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT',
);
