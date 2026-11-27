export interface ILedgerAppendReportWorkerFailedCommand {
  operationKey: string;
  attempt: number;
  attempts: number;
  error: Error;
}
