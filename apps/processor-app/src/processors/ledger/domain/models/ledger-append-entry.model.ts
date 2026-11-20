import {
  LedgerActionRequiredException,
  LedgerInstantInvalidException,
  LedgerOperationKeyRequiredException,
} from '../errors';
import { LedgerInstantValue } from '../values/ledger-instant.value';
import type {
  ILedgerAppendEntryCandidate,
  ILedgerAppendEntryCandidateInit,
  ILedgerAppendEntryLoggerPayload,
} from '../interfaces';

export class LedgerAppendEntryModel {
  public static initCandidate(
    proposal: ILedgerAppendEntryCandidateInit,
  ): ILedgerAppendEntryCandidate {
    const { operationKey, subjectType, subjectId, action, payload, correlationId, occurredAt } =
      proposal;
    const key = operationKey.trim();
    const verb = action.trim();

    if (key.length === 0) {
      throw new LedgerOperationKeyRequiredException();
    }

    if (verb.length === 0) {
      throw new LedgerActionRequiredException();
    }

    const instant = LedgerInstantValue.create(occurredAt);

    if (!instant.hasExplicitZone()) {
      throw new LedgerInstantInvalidException(
        occurredAt,
        `occurredAt must be an ISO-8601 instant with an explicit timezone offset, got ${occurredAt}`,
      );
    }

    if (!instant.isValid()) {
      throw new LedgerInstantInvalidException(occurredAt);
    }

    return {
      operationKey: key,
      subjectType,
      subjectId,
      action: verb,
      payload,
      correlationId,
      occurredAt: instant.toDate(),
    };
  }

  public static toLoggerPayload(
    id: string,
    candidate: ILedgerAppendEntryCandidate,
  ): ILedgerAppendEntryLoggerPayload {
    return { id, operationKey: candidate.operationKey };
  }
}
