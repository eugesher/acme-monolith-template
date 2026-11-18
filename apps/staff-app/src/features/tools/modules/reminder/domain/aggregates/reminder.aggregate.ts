import { VersionedEntity } from '@acme-libs/domain';
import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderAlreadyDoneException } from '../exceptions/reminder-already-done.exception';
import { ReminderBodyInvalidException } from '../exceptions/reminder-body-invalid.exception';
import { ReminderDueOnInvalidException } from '../exceptions/reminder-due-on-invalid.exception';
import { ReminderTitleInvalidException } from '../exceptions/reminder-title-invalid.exception';
import { ReminderVersionInvalidException } from '../exceptions/reminder-version-invalid.exception';
import type {
  IReminderReconstitute,
  IReminderSnapshot,
  IReminderUpdatePayload,
} from '../interfaces';

export abstract class ReminderAggregate extends VersionedEntity {
  protected readonly ownerId: string;
  protected readonly title: string;
  protected readonly body: string;
  protected currentDueOn: string;
  protected currentStatus: ReminderStatusEnum;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  private static readonly TITLE_MAX_LENGTH = 255;
  private static readonly BODY_MAX_LENGTH = 2000;
  private static readonly DUE_ON_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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
      dueOn: this.currentDueOn,
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
      dueOn: this.currentDueOn,
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

  protected static validDueOn(dueOn: string): string {
    if (!ReminderAggregate.DUE_ON_PATTERN.test(dueOn)) {
      throw new ReminderDueOnInvalidException(dueOn);
    }

    const parsedDueOn = new Date(`${dueOn}T00:00:00.000Z`);

    if (Number.isNaN(parsedDueOn.getTime()) || parsedDueOn.toISOString().slice(0, 10) !== dueOn) {
      throw new ReminderDueOnInvalidException(
        dueOn,
        `Reminder.dueOn is not a real calendar date: ${dueOn}`,
      );
    }

    return dueOn;
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
