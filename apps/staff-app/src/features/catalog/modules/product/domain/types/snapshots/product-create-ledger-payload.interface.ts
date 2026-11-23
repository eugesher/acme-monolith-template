export interface IProductCreateLedgerPayload {
  readonly subjectId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly sku: string;
    readonly name: string;
  };
}
