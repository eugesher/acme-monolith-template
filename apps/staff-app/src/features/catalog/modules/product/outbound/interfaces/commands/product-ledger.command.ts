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
  subjectId: string;
  occurredAt: string;
  payload: {
    sku: string;
    name: string;
  };
}
