export interface IOrderProductStockLockCommand {
  productIds: readonly string[];
}

export interface IOrderProductStockWithdrawCommand {
  movements: {
    productId: string;
    orderProductId: string;
  }[];
}
