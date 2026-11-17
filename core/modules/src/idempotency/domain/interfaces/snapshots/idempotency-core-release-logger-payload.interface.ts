export interface IIdempotencyCoreReleaseLoggerPayload {
  readonly scope: string;
  readonly idempotencyKey: string;
}
