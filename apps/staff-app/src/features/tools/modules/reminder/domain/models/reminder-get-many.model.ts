import type { ReminderStatusEnum } from '@acme-libs/kernel';

import type { IReminderGetManyReconstitute, IReminderGetManySnapshot } from '../interfaces';

export class ReminderGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly ownerId: string,
    private readonly title: string,
    private readonly body: string,
    private readonly dueOn: string,
    private readonly status: ReminderStatusEnum,
    private readonly version: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static toViewData(records: IReminderGetManyReconstitute[]): IReminderGetManySnapshot[] {
    return records.map((record) => {
      const reminder = ReminderGetManyModel.reconstitute(record);

      return reminder.toSnapshot();
    });
  }

  private static reconstitute(record: IReminderGetManyReconstitute): ReminderGetManyModel {
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
