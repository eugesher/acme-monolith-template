import type { ReminderStatusEnum } from '@acme-libs/kernel';

import type { IReminderGetManyReconstitute, IReminderGetManySnapshot } from '../interfaces';

export class ReminderGetManyModel {
  private constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly body: string,
    public readonly dueOn: string,
    public readonly status: ReminderStatusEnum,
    public readonly version: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static reconstitute(record: IReminderGetManyReconstitute): ReminderGetManyModel {
    const { id, ownerId, title, body, dueOn, status, version, createdAt, updatedAt } = record;

    return new ReminderGetManyModel(
      id,
      ownerId,
      title,
      body,
      dueOn,
      status,
      version,
      createdAt,
      updatedAt,
    );
  }

  public static toViewData(records: IReminderGetManyReconstitute[]): IReminderGetManySnapshot[] {
    return records.map((record) => {
      const reminder = ReminderGetManyModel.reconstitute(record);

      return reminder.toSnapshot();
    });
  }

  private toSnapshot(): IReminderGetManySnapshot {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      body: this.body,
      dueOn: this.dueOn,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
