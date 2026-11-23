import type {
  IIdempotencyCoreReleaseLoggerPayload,
  IIdempotencyCoreReleaseLoggerPayloadBuild,
} from '../types';

export class IdempotencyCoreReleaseModel {
  public static toLoggerPayload(
    params: IIdempotencyCoreReleaseLoggerPayloadBuild,
  ): IIdempotencyCoreReleaseLoggerPayload {
    const { scope, key } = params;

    return { scope, idempotencyKey: key };
  }
}
