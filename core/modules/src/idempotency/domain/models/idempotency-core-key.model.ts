import { IdempotencyStatusEnum } from '@acme-libs/kernel';
import type { Nullable } from '@acme-libs/toolkit';

import type {
  IIdempotencyCoreKeyCandidate,
  IIdempotencyCoreKeyCandidateInit,
  IIdempotencyCoreKeyCompletePayload,
  IIdempotencyCoreKeyCompletePayloadBuild,
  IIdempotencyCoreKeyLoggerPayload,
  IIdempotencyCoreKeyLoggerPayloadBuild,
  IIdempotencyCoreKeyReconstitute,
} from '../interfaces';

export class IdempotencyCoreKeyModel {
  private static readonly MAX_KEY_LENGTH = 128;

  private constructor(
    public readonly requestFingerprint: string,
    public readonly status: IdempotencyStatusEnum,
    public readonly responseBody: Nullable<string>,
  ) {
    Object.freeze(this);
  }

  public static reconstitute(record: IIdempotencyCoreKeyReconstitute): IdempotencyCoreKeyModel {
    const { requestFingerprint, status, responseBody } = record;

    return new IdempotencyCoreKeyModel(requestFingerprint, status, responseBody);
  }

  public static initCandidate(
    proposal: IIdempotencyCoreKeyCandidateInit,
  ): IIdempotencyCoreKeyCandidate {
    const { scope, key, requestFingerprint } = proposal;

    if (key.length === 0) {
      throw new Error('IdempotencyKey.key is required');
    }

    if (key.length > IdempotencyCoreKeyModel.MAX_KEY_LENGTH) {
      throw new Error('IdempotencyKey.key must be at most 128 characters');
    }

    return {
      scope,
      idempotencyKey: key,
      requestFingerprint,
      status: IdempotencyStatusEnum.IN_FLIGHT,
      responseBody: null,
    };
  }

  public static toCompletePayload(
    params: IIdempotencyCoreKeyCompletePayloadBuild,
  ): IIdempotencyCoreKeyCompletePayload {
    const { scope, key, response } = params;
    const responseBody = JSON.stringify(response);

    return { scope, key, responseBody };
  }

  public static toKeyLoggerPayload(
    params: IIdempotencyCoreKeyLoggerPayloadBuild,
  ): IIdempotencyCoreKeyLoggerPayload {
    const { scope, key } = params;

    return { scope, idempotencyKey: key };
  }

  public matches(requestFingerprint: string): boolean {
    return this.requestFingerprint === requestFingerprint;
  }

  public isCompleted(): this is IdempotencyCoreKeyModel & { responseBody: string } {
    return this.status === IdempotencyStatusEnum.COMPLETED && this.responseBody !== null;
  }

  public toStoredResponse(): unknown {
    return this.responseBody === null ? null : JSON.parse(this.responseBody);
  }
}
