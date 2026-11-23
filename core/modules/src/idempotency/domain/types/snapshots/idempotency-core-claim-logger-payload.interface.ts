export interface IIdempotencyCoreClaimLoggerPayload {
  readonly scope: string;
  readonly idempotencyKey: string;
}
