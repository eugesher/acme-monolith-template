export interface IIdempotencyCoreKeyCompletePayload {
  readonly scope: string;
  readonly key: string;
  readonly responseBody: string;
}
