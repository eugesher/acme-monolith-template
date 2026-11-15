export interface IOrderLedgerRecordPlacedCommand {
  subjectId: string;
  occurredAt: string;
  payload: {
    customerId: string;
    orderProducts: {
      id: string;
      productId: string;
      product: {
        sku: string;
        name: string;
      };
    }[];
  };
}
