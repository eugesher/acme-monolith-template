export interface IOrderLedgerRecordPlacedCommand {
  readonly subjectId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly customerId: string;
    readonly orderProducts: readonly {
      readonly id: string;
      readonly productId: string;
      readonly product: {
        readonly sku: string;
        readonly name: string;
      };
    }[];
  };
}
