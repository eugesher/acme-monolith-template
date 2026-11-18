import { LedgerActionRequiredException } from '../exceptions/ledger-action-required.exception';
import { LedgerInstantInvalidException } from '../exceptions/ledger-instant-invalid.exception';
import { LedgerOperationKeyRequiredException } from '../exceptions/ledger-operation-key-required.exception';
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

    if (Number.isNaN(occurredAt.getTime())) {
      throw new LedgerInstantInvalidException();
    }

    return {
      operationKey: key,
      subjectType,
      subjectId,
      action: verb,
      payload,
      correlationId,
      occurredAt,
    };
  }

  public static toLoggerPayload(
    id: string,
    candidate: ILedgerAppendEntryCandidate,
  ): ILedgerAppendEntryLoggerPayload {
    return { id, operationKey: candidate.operationKey };
  }
}
