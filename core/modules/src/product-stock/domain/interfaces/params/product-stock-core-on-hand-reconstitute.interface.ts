interface IProductStockCoreOnHandReconstituteStockSum {
  productId: string;
  quantity: number | string;
}

export interface IProductStockCoreOnHandReconstitute {
  products: { id: string }[];
  stockSums: IProductStockCoreOnHandReconstituteStockSum[];
}
