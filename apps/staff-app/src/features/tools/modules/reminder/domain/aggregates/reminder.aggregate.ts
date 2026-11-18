import { VersionedEntity } from '@acme-libs/domain';
import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderAlreadyDoneException } from '../exceptions/reminder-already-done.exception';
import { ReminderBodyInvalidException } from '../exceptions/reminder-body-invalid.exception';
import { ReminderDueOnInvalidException } from '../exceptions/reminder-due-on-invalid.exception';
import { ReminderTitleInvalidException } from '../exceptions/reminder-title-invalid.exception';
import { ReminderVersionInvalidException } from '../exceptions/reminder-version-invalid.exception';
import { ReminderDueOnValue } from '../values/reminder-due-on.value';
import type {
  IReminderReconstitute,
  IReminderSnapshot,
  IReminderUpdatePayload,
} from '../interfaces';

export abstract class ReminderAggregate extends VersionedEntity {
  protected readonly ownerId: string;
  protected readonly title: string;
  protected readonly body: string;
  protected currentDueOn: ReminderDueOnValue;
  protected currentStatus: ReminderStatusEnum;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  private static readonly TITLE_MAX_LENGTH = 255;
  private static readonly BODY_MAX_LENGTH = 2000;

  protected constructor(record: IReminderReconstitute) {
    const { id, ownerId, title, body, dueOn, status, version, createdAt, updatedAt } = record;
    const validVersion = ReminderAggregate.validVersion(version);

    super(id, validVersion);

    this.ownerId = ownerId;
    this.title = ReminderAggregate.validTitle(title);
    this.body = ReminderAggregate.validBody(body);
    this.currentDueOn = ReminderAggregate.validDueOn(dueOn);
    this.currentStatus = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toSnapshot(): IReminderSnapshot {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      body: this.body,
      dueOn: this.currentDueOn.isoDate,
      status: this.currentStatus,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public toUpdatePayload(versionAsRead: number): IReminderUpdatePayload {
    return {
      id: this.id,
      versionAsRead,
      dueOn: this.currentDueOn.isoDate,
      status: this.currentStatus,
      version: this.version,
    };
  }

  protected static validTitle(title: string): string {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0 || trimmedTitle.length > ReminderAggregate.TITLE_MAX_LENGTH) {
      throw new ReminderTitleInvalidException(ReminderAggregate.TITLE_MAX_LENGTH);
    }

    return trimmedTitle;
  }

  protected static validBody(body: string): string {
    const trimmedBody = body.trim();

    if (trimmedBody.length > ReminderAggregate.BODY_MAX_LENGTH) {
      throw new ReminderBodyInvalidException(ReminderAggregate.BODY_MAX_LENGTH);
    }

    return trimmedBody;
  }

  protected static validDueOn(dueOn: string): ReminderDueOnValue {
    const dueOnValue = ReminderDueOnValue.create(dueOn);

    if (!dueOnValue.isFormatted()) {
      throw new ReminderDueOnInvalidException(dueOn);
    }

    if (!dueOnValue.isCalendarDate()) {
      throw new ReminderDueOnInvalidException(
        dueOn,
        `Reminder.dueOn is not a real calendar date: ${dueOn}`,
      );
    }

    return dueOnValue;
  }

  protected assertPending(): void {
    if (this.currentStatus === ReminderStatusEnum.DONE) {
      throw new ReminderAlreadyDoneException(this.id);
    }
  }

  private static validVersion(version: number): number {
    if (!VersionedEntity.isValidVersion(version)) {
      throw new ReminderVersionInvalidException(version);
    }

    return version;
  }
}
