import { VersionedEntity } from '@acme-libs/domain';
import type { Maybe } from '@acme-libs/toolkit';

import {
  NoteBodyInvalidException,
  NoteResolvedException,
  NoteSubjectInvalidException,
  NoteTitleInvalidException,
  NoteVersionInvalidException,
  NoteVersionMismatchException,
} from '../errors';
import type { INoteReconstitute, INoteSnapshot, INoteUpdatePayload } from '../types';

export abstract class NoteAggregate extends VersionedEntity {
  protected title: string;
  protected body: string;
  protected resolved: boolean;
  protected readonly subjectType: string;
  protected readonly subjectId: string;
  protected readonly authorId: string;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  private static readonly SUBJECT_TYPE_PATTERN = /^[a-z][a-z-]{1,63}$/;
  private static readonly SUBJECT_ID_MAX_LENGTH = 64;
  private static readonly TITLE_MAX_LENGTH = 100;
  private static readonly BODY_MAX_LENGTH = 4000;

  protected constructor(record: INoteReconstitute) {
    const {
      id,
      subjectType,
      subjectId,
      title,
      body,
      authorId,
      resolved,
      version,
      createdAt,
      updatedAt,
    } = record;
    const validVersion = NoteAggregate.validVersion(version);

    super(id, validVersion);

    this.subjectType = NoteAggregate.validSubjectType(subjectType);
    this.subjectId = NoteAggregate.validSubjectId(subjectId);
    this.authorId = authorId;
    this.title = NoteAggregate.validTitle(title);
    this.body = NoteAggregate.validBody(body);
    this.resolved = resolved;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public assertExpectedVersion(expectedVersion: Maybe<number>): void {
    if (this.isExpectedVersion(expectedVersion)) {
      return;
    }

    throw new NoteVersionMismatchException(this.id, expectedVersion, this.version);
  }

  public toUpdatePayload(versionAsRead: number): INoteUpdatePayload {
    return {
      id: this.id,
      versionAsRead,
      title: this.title,
      body: this.body,
      resolved: this.resolved,
      version: this.version,
    };
  }

  public toSnapshot(): INoteSnapshot {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      title: this.title,
      body: this.body,
      authorId: this.authorId,
      resolved: this.resolved,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  protected static validSubjectType(subjectType: string): string {
    if (!NoteAggregate.SUBJECT_TYPE_PATTERN.test(subjectType)) {
      throw new NoteSubjectInvalidException(
        `Note.subjectType must match ${String(NoteAggregate.SUBJECT_TYPE_PATTERN)}, got ${subjectType}`,
      );
    }

    return subjectType;
  }

  protected static validSubjectId(subjectId: string): string {
    const trimmedSubjectId = subjectId.trim();

    if (
      trimmedSubjectId.length === 0 ||
      trimmedSubjectId.length > NoteAggregate.SUBJECT_ID_MAX_LENGTH
    ) {
      throw new NoteSubjectInvalidException(
        `Note.subjectId must be a non-empty string of at most ${NoteAggregate.SUBJECT_ID_MAX_LENGTH} characters`,
      );
    }

    return trimmedSubjectId;
  }

  protected static validTitle(title: string): string {
    const trimmedTitle = title.trim();
    const length = Array.from(trimmedTitle).length;

    if (length === 0 || length > NoteAggregate.TITLE_MAX_LENGTH) {
      throw new NoteTitleInvalidException(NoteAggregate.TITLE_MAX_LENGTH);
    }

    return trimmedTitle;
  }

  protected static titleOf(body: string): string {
    return Array.from(body).slice(0, NoteAggregate.TITLE_MAX_LENGTH).join('').trimEnd();
  }

  protected static validBody(body: string): string {
    const trimmedBody = body.trim();

    if (trimmedBody.length === 0 || trimmedBody.length > NoteAggregate.BODY_MAX_LENGTH) {
      throw new NoteBodyInvalidException(NoteAggregate.BODY_MAX_LENGTH);
    }

    return trimmedBody;
  }

  protected assertOpen(): void {
    if (this.resolved) {
      throw new NoteResolvedException(this.id);
    }
  }

  private static validVersion(version: number): number {
    if (!VersionedEntity.isValidVersion(version)) {
      throw new NoteVersionInvalidException(version);
    }

    return version;
  }
}
