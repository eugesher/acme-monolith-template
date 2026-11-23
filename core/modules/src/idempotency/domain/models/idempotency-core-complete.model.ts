import type {
  IIdempotencyCoreCompleteUpdatePayload,
  IIdempotencyCoreCompleteUpdatePayloadBuild,
} from '../types';

export class IdempotencyCoreCompleteModel {
  public static toUpdatePayload(
    params: IIdempotencyCoreCompleteUpdatePayloadBuild,
  ): IIdempotencyCoreCompleteUpdatePayload {
    const { scope, key, response } = params;
    const responseBody = JSON.stringify(response);

    return { scope, key, responseBody };
  }
}
