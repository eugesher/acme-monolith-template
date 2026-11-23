import type { ILedgerListEntriesReconstitute, ILedgerListEntriesSnapshot } from '../types';

export class LedgerListEntriesModel {
  private constructor(
    private readonly id: string,
    private readonly operationKey: string,
    private readonly subjectType: string,
    private readonly subjectId: string,
    private readonly action: string,
    private readonly payload: Record<string, unknown>,
    private readonly correlationId: string,
    private readonly occurredAt: Date,
    private readonly recordedAt: Date,
  ) {}

  public static toViewData(
    records: ILedgerListEntriesReconstitute[],
  ): ILedgerListEntriesSnapshot[] {
    return records.map((record) => {
      const ledgerEntry = LedgerListEntriesModel.reconstitute(record);

      return ledgerEntry.toSnapshot();
    });
  }

  private static reconstitute(record: ILedgerListEntriesReconstitute): LedgerListEntriesModel {
    const {
      id,
      operationKey,
      subjectType,
      subjectId,
      action,
      payload,
      correlationId,
      occurredAt,
      recordedAt,
    } = record;

    return new LedgerListEntriesModel(
      id,
      operationKey,
      subjectType,
      subjectId,
      action,
      payload,
      correlationId,
      occurredAt,
      recordedAt,
    );
  }

  private toSnapshot(): ILedgerListEntriesSnapshot {
    return {
      id: this.id,
      operationKey: this.operationKey,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      action: this.action,
      payload: this.payload,
      correlationId: this.correlationId,
      occurredAt: this.occurredAt.toISOString(),
      recordedAt: this.recordedAt.toISOString(),
    };
  }
}
