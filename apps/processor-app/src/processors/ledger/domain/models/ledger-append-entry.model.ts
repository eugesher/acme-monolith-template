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
      throw new Error('LedgerEntry.operationKey is required');
    }

    if (verb.length === 0) {
      throw new Error('LedgerEntry.action is required');
    }

    if (Number.isNaN(occurredAt.getTime())) {
      throw new Error('LedgerEntry.occurredAt must be a valid instant');
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
