export interface ILedgerGetManyListQuery {
  limit: number;
  offset: number;
  subjectType?: string;
  subjectId?: string;
  correlationId?: string;
}
