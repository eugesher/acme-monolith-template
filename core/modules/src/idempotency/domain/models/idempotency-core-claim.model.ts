import { IdempotencyStatusEnum } from '@acme-libs/kernel';
import type { Nullable } from '@acme-libs/toolkit';

import type {
  IIdempotencyCoreClaimCandidate,
  IIdempotencyCoreClaimCandidateInit,
  IIdempotencyCoreClaimLoggerPayload,
  IIdempotencyCoreClaimLoggerPayloadBuild,
  IIdempotencyCoreClaimReconstitute,
} from '../types';

export class IdempotencyCoreClaimModel {
  private static readonly MAX_KEY_LENGTH = 128;

  private constructor(
    private readonly requestFingerprint: string,
    private readonly status: IdempotencyStatusEnum,
    private readonly responseBody: Nullable<string>,
  ) {
    Object.freeze(this);
  }

  public static initCandidate(
    proposal: IIdempotencyCoreClaimCandidateInit,
  ): IIdempotencyCoreClaimCandidate {
    const { scope, key, requestFingerprint } = proposal;

    if (key.length === 0) {
      throw new Error('IdempotencyKey.key is required');
    }

    if (key.length > IdempotencyCoreClaimModel.MAX_KEY_LENGTH) {
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

  public static reconstitute(record: IIdempotencyCoreClaimReconstitute): IdempotencyCoreClaimModel {
    const { requestFingerprint, status, responseBody } = record;

    return new IdempotencyCoreClaimModel(requestFingerprint, status, responseBody);
  }

  public static toLoggerPayload(
    params: IIdempotencyCoreClaimLoggerPayloadBuild,
  ): IIdempotencyCoreClaimLoggerPayload {
    const { scope, key } = params;

    return { scope, idempotencyKey: key };
  }

  public matches(requestFingerprint: string): boolean {
    return this.requestFingerprint === requestFingerprint;
  }

  public isCompleted(): boolean {
    return this.status === IdempotencyStatusEnum.COMPLETED && this.responseBody !== null;
  }

  public toStoredResponse(): unknown {
    return this.responseBody === null ? null : JSON.parse(this.responseBody);
  }
}
