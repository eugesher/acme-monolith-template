interface IProductStockCoreOnHandReconstituteStockSum {
  productId: string;
  quantity: number;
}

export interface IProductStockCoreOnHandReconstitute {
  products: { id: string }[];
  stockSums: IProductStockCoreOnHandReconstituteStockSum[];
}
