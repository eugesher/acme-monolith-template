export interface IIdempotencyCoreKeyLoggerPayload {
  readonly scope: string;
  readonly idempotencyKey: string;
}
