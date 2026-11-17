export interface IIdempotencyCoreCompleteUpdatePayload {
  readonly scope: string;
  readonly key: string;
  readonly responseBody: string;
}
