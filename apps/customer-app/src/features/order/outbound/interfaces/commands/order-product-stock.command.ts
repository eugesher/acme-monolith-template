export interface IOrderProductStockLockCommand {
  productIds: string[];
}

export interface IOrderProductStockWithdrawCommand {
  movements: {
    productId: string;
    orderProductId: string;
  }[];
}
