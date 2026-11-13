import type { IOrderProductStockMovement } from '../../../domain';

export interface IOrderProductStockLockCommand {
  productIds: string[];
}

export interface IOrderProductStockWithdrawCommand {
  movements: IOrderProductStockMovement[];
}
