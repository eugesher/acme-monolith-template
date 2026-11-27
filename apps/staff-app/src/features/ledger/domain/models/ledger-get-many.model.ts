import type { ILedgerGetManyReconstitute, ILedgerGetManySnapshot } from '../types';

export class LedgerGetManyModel {
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

  public static toViewData(records: ILedgerGetManyReconstitute[]): ILedgerGetManySnapshot[] {
    return records.map((record) => {
      const ledgerEntry = LedgerGetManyModel.reconstitute(record);

      return ledgerEntry.toSnapshot();
    });
  }

  private static reconstitute(record: ILedgerGetManyReconstitute): LedgerGetManyModel {
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

    return new LedgerGetManyModel(
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

  private toSnapshot(): ILedgerGetManySnapshot {
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
