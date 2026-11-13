export interface IProductLedgerRecordEventsCommand {
  ledgerRecords: {
    operationKey: string;
    subjectType: string;
    subjectId: string;
    action: string;
    payload: Record<string, unknown>;
    occurredAt: string;
  }[];
}

export interface IProductLedgerRecordCreatedCommand {
  productId: string;
  sku: string;
  name: string;
}
