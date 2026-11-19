import { VersionedEntity } from '@acme-libs/domain';
import type { Maybe } from '@acme-libs/toolkit';

import { NoteBodyInvalidException } from '../exceptions/note-body-invalid.exception';
import { NoteResolvedException } from '../exceptions/note-resolved.exception';
import { NoteSubjectInvalidException } from '../exceptions/note-subject-invalid.exception';
import { NoteVersionInvalidException } from '../exceptions/note-version-invalid.exception';
import { NoteVersionMismatchException } from '../exceptions/note-version-mismatch.exception';
import type { INoteReconstitute, INoteSnapshot, INoteUpdatePayload } from '../interfaces';

export abstract class NoteAggregate extends VersionedEntity {
  protected readonly subjectType: string;
  protected readonly subjectId: string;
  protected readonly authorId: string;
  protected currentBody: string;
  protected currentResolved: boolean;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  private static readonly SUBJECT_TYPE_PATTERN = /^[a-z][a-z-]{1,63}$/;
  private static readonly SUBJECT_ID_MAX_LENGTH = 64;
  private static readonly BODY_MAX_LENGTH = 4000;

  protected constructor(record: INoteReconstitute) {
    const { id, subjectType, subjectId, body, authorId, resolved, version, createdAt, updatedAt } =
      record;
    const validVersion = NoteAggregate.validVersion(version);

    super(id, validVersion);

    this.subjectType = NoteAggregate.validSubjectType(subjectType);
    this.subjectId = NoteAggregate.validSubjectId(subjectId);
    this.authorId = authorId;
    this.currentBody = NoteAggregate.validBody(body);
    this.currentResolved = resolved;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toSnapshot(): INoteSnapshot {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      body: this.currentBody,
      authorId: this.authorId,
      resolved: this.currentResolved,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public toUpdatePayload(versionAsRead: number): INoteUpdatePayload {
    return {
      id: this.id,
      versionAsRead,
      body: this.currentBody,
      resolved: this.currentResolved,
      version: this.version,
    };
  }

  public assertExpectedVersion(expectedVersion: Maybe<number>): void {
    if (this.isExpectedVersion(expectedVersion)) {
      return;
    }

    throw new NoteVersionMismatchException(this.id, expectedVersion, this.version);
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

  protected static validBody(body: string): string {
    const trimmedBody = body.trim();

    if (trimmedBody.length === 0 || trimmedBody.length > NoteAggregate.BODY_MAX_LENGTH) {
      throw new NoteBodyInvalidException(NoteAggregate.BODY_MAX_LENGTH);
    }

    return trimmedBody;
  }

  protected assertOpen(): void {
    if (this.currentResolved) {
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
