import type {
  IProductStockCoreMoveInsertQuery,
  IProductStockCoreMoveInsertRecord,
  IProductStockCoreMoveProductRecord,
  IProductStockCoreMoveSumRecord,
} from '../types';

export interface IProductStockCoreMoveRepositoryPort {
  lockMany(productIds: readonly string[]): Promise<IProductStockCoreMoveProductRecord[]>;
  insertMany(
    queries: IProductStockCoreMoveInsertQuery[],
  ): Promise<IProductStockCoreMoveInsertRecord[]>;
  sumStock(productIds: readonly string[]): Promise<IProductStockCoreMoveSumRecord[]>;
}

export const PRODUCT_STOCK_CORE_MOVE_REPOSITORY_PORT = Symbol(
  'PRODUCT_STOCK_CORE_MOVE_REPOSITORY_PORT',
);
