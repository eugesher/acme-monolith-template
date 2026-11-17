import { AggregateRootBase } from '@acme-libs/toolkit';

import { NoteBodyInvalidException } from '../exceptions/note-body-invalid.exception';
import { NoteResolvedException } from '../exceptions/note-resolved.exception';
import { NoteSubjectInvalidException } from '../exceptions/note-subject-invalid.exception';
import { NoteVersionInvalidException } from '../exceptions/note-version-invalid.exception';
import type {
  INoteCandidate,
  INoteCandidateInit,
  INoteCreateLoggerPayload,
  INoteEditLoggerPayload,
  INoteReconstitute,
  INoteResolveLoggerPayload,
  INoteRevisionInsertPayload,
  INoteRevisionInsertPayloadBuild,
  INoteSnapshot,
  INoteUpdatePayload,
} from '../interfaces';

export class NoteModel extends AggregateRootBase {
  public get body(): string {
    return this.currentBody;
  }

  public get resolved(): boolean {
    return this.currentResolved;
  }

  public get version(): number {
    return this.currentVersion;
  }

  private static readonly SUBJECT_TYPE_PATTERN = /^[a-z][a-z-]{1,63}$/;
  private static readonly SUBJECT_ID_MAX_LENGTH = 64;
  private static readonly BODY_MAX_LENGTH = 4000;

  private constructor(
    id: string,
    public readonly subjectType: string,
    public readonly subjectId: string,
    private currentBody: string,
    public readonly authorId: string,
    private currentResolved: boolean,
    private currentVersion: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    super(id);
  }

  public static reconstitute(record: INoteReconstitute): NoteModel {
    const { id, subjectType, subjectId, body, authorId, resolved, version, createdAt, updatedAt } =
      record;
    const validSubjectType = NoteModel.validSubjectType(subjectType);
    const validSubjectId = NoteModel.validSubjectId(subjectId);
    const validBody = NoteModel.validBody(body);
    const validVersion = NoteModel.validVersion(version);

    return new NoteModel(
      id,
      validSubjectType,
      validSubjectId,
      validBody,
      authorId,
      resolved,
      validVersion,
      createdAt,
      updatedAt,
    );
  }

  public static initCandidate(proposal: INoteCandidateInit): INoteCandidate {
    const { subjectType, subjectId, body, authorId } = proposal;
    const validSubjectType = NoteModel.validSubjectType(subjectType);
    const validSubjectId = NoteModel.validSubjectId(subjectId);
    const validBody = NoteModel.validBody(body);

    return {
      subjectType: validSubjectType,
      subjectId: validSubjectId,
      body: validBody,
      authorId,
      resolved: false,
      version: 1,
    };
  }

  public edit(body: string): void {
    this.assertOpen();

    const validBody = NoteModel.validBody(body);

    if (validBody === this.currentBody) {
      return;
    }

    this.currentBody = validBody;
    this.currentVersion += 1;
  }

  public resolve(): void {
    this.assertOpen();

    this.currentResolved = true;
    this.currentVersion += 1;
  }

  public toSnapshot(): INoteSnapshot {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      body: this.body,
      authorId: this.authorId,
      resolved: this.resolved,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public toUpdatePayload(versionAsRead: number): INoteUpdatePayload {
    return {
      id: this.id,
      versionAsRead,
      body: this.body,
      resolved: this.resolved,
      version: this.version,
    };
  }

  public toRevisionInsertPayload(
    params: INoteRevisionInsertPayloadBuild,
  ): INoteRevisionInsertPayload {
    const { bodyBefore, editorId, correlationId } = params;

    return {
      noteId: this.id,
      noteVersion: this.version,
      bodyBefore,
      bodyAfter: this.body,
      editorId,
      correlationId,
    };
  }

  public toCreateLoggerPayload(): INoteCreateLoggerPayload {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      authorId: this.authorId,
    };
  }

  public toEditLoggerPayload(): INoteEditLoggerPayload {
    return { id: this.id, authorId: this.authorId, version: this.version };
  }

  public toResolveLoggerPayload(): INoteResolveLoggerPayload {
    return { id: this.id, version: this.version };
  }

  private static validSubjectType(subjectType: string): string {
    if (!NoteModel.SUBJECT_TYPE_PATTERN.test(subjectType)) {
      throw new NoteSubjectInvalidException(
        `Note.subjectType must match ${String(NoteModel.SUBJECT_TYPE_PATTERN)}, got ${subjectType}`,
      );
    }

    return subjectType;
  }

  private static validSubjectId(subjectId: string): string {
    const trimmedSubjectId = subjectId.trim();

    if (
      trimmedSubjectId.length === 0 ||
      trimmedSubjectId.length > NoteModel.SUBJECT_ID_MAX_LENGTH
    ) {
      throw new NoteSubjectInvalidException(
        `Note.subjectId must be a non-empty string of at most ${NoteModel.SUBJECT_ID_MAX_LENGTH} characters`,
      );
    }

    return trimmedSubjectId;
  }

  private static validBody(body: string): string {
    const trimmedBody = body.trim();

    if (trimmedBody.length === 0 || trimmedBody.length > NoteModel.BODY_MAX_LENGTH) {
      throw new NoteBodyInvalidException(NoteModel.BODY_MAX_LENGTH);
    }

    return trimmedBody;
  }

  private static validVersion(version: number): number {
    if (!Number.isInteger(version) || version < 1) {
      throw new NoteVersionInvalidException(version);
    }

    return version;
  }

  private assertOpen(): void {
    if (this.currentResolved) {
      throw new NoteResolvedException(this.id);
    }
  }
}
