export interface IProductStockPostSubtractReportWorkerFailedCommand {
  productIds: string[];
  attempt: number;
  attempts: number;
  error: Error;
}
