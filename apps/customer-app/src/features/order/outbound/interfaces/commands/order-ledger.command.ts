export interface IOrderLedgerRecordPlacedCommand {
  subjectId: string;
  occurredAt: string;
  payload: {
    customerId: string;
    orderProducts: {
      id: string;
      product: {
        id: string;
      };
    }[];
  };
}
