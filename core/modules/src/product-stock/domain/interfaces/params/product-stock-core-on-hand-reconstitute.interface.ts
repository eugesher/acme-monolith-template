interface IProductStockCoreOnHandReconstituteStockSum {
  productId: string;
  quantity: number | string;
}

export interface IProductStockCoreOnHandReconstitute {
  productIds: string[];
  stockSums: IProductStockCoreOnHandReconstituteStockSum[];
}
