import { NoteModel } from '../note.model';

describe('NoteModel', () => {
  describe('reconstitute', () => {
    it('restores a stored note as it was', () => {
      const note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: true,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(note.id).toBe('7');
      expect(note.resolved).toBe(true);
      expect(note.version).toBe(3);
      expect(note.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
      expect(note.updatedAt).toEqual(new Date('2026-01-02T00:00:00.000Z'));
    });

    it.each([0, 1.5])('refuses version %s with NOTE_VERSION_INVALID', (version) => {
      expect(() =>
        NoteModel.reconstitute({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
          resolved: false,
          version,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'NOTE_VERSION_INVALID',
          message: `Note.version must be a positive integer, got ${version}`,
        }) as Error,
      );
    });
  });

  describe('initCandidate', () => {
    it('initializes an unresolved note candidate at version 1 with a trimmed subject id and body', () => {
      const candidate = NoteModel.initCandidate({
        subjectType: 'product',
        subjectId: '  42  ',
        body: '  Check the supplier  ',
        authorId: 'admin-1',
      });

      expect(candidate).toEqual({
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 1,
      });
    });

    it('accepts any subject the pattern allows, without checking it exists', () => {
      const candidate = NoteModel.initCandidate({
        subjectType: 'support-ticket',
        subjectId: 'TCK-0001',
        body: 'Escalated',
        authorId: 'admin-1',
      });

      expect(candidate.subjectType).toBe('support-ticket');
      expect(candidate.subjectId).toBe('TCK-0001');
    });

    it.each([
      ['a capital letter', 'Product'],
      ['a single letter', 'i'],
      ['a leading dash', '-product'],
      ['a digit', 'product2'],
      ['65 characters', `i${'t'.repeat(64)}`],
    ])('refuses a subject type with %s with NOTE_SUBJECT_INVALID', (_, subjectType) => {
      expect(() =>
        NoteModel.initCandidate({
          subjectType,
          subjectId: '42',
          body: 'Body',
          authorId: 'admin-1',
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'NOTE_SUBJECT_INVALID',
          message: `Note.subjectType must match /^[a-z][a-z-]{1,63}$/, got ${subjectType}`,
        }) as Error,
      );
    });

    it('accepts a subject type of 64 characters and a subject id of 64', () => {
      const candidate = NoteModel.initCandidate({
        subjectType: `i${'t'.repeat(63)}`,
        subjectId: 's'.repeat(64),
        body: 'Body',
        authorId: 'admin-1',
      });

      expect(candidate.subjectType).toHaveLength(64);
      expect(candidate.subjectId).toHaveLength(64);
    });

    it.each([
      ['a blank subject id', '   '],
      ['a subject id longer than 64', 's'.repeat(65)],
    ])('refuses %s with NOTE_SUBJECT_INVALID', (_, subjectId) => {
      expect(() =>
        NoteModel.initCandidate({
          subjectType: 'product',
          subjectId,
          body: 'Body',
          authorId: 'admin-1',
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'NOTE_SUBJECT_INVALID',
          message: 'Note.subjectId must be a non-empty string of at most 64 characters',
        }) as Error,
      );
    });

    it('accepts a body of 4000 characters', () => {
      const candidate = NoteModel.initCandidate({
        subjectType: 'product',
        subjectId: '42',
        body: 'b'.repeat(4000),
        authorId: 'admin-1',
      });

      expect(candidate.body).toHaveLength(4000);
    });

    it.each([
      ['a blank body', '   '],
      ['a body longer than 4000', 'b'.repeat(4001)],
    ])('refuses %s with NOTE_BODY_INVALID', (_, body) => {
      expect(() =>
        NoteModel.initCandidate({
          subjectType: 'product',
          subjectId: '42',
          body,
          authorId: 'admin-1',
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'NOTE_BODY_INVALID',
          message: 'Note.body must be a non-empty string of at most 4000 characters',
        }) as Error,
      );
    });
  });

  describe('edit', () => {
    let note: NoteModel;

    beforeEach(() => {
      note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it('replaces the body with the trimmed one and bumps the version', () => {
      note.edit('  Supplier confirmed  ');

      expect(note.body).toBe('Supplier confirmed');
      expect(note.version).toBe(3);
    });

    it('changes nothing when the trimmed body is the current one', () => {
      note.edit('  Check the supplier ');

      expect(note.body).toBe('Check the supplier');
      expect(note.version).toBe(2);
    });

    it('refuses a blank body with NOTE_BODY_INVALID and keeps the note', () => {
      expect(() => note.edit('   ')).toThrow(
        expect.objectContaining({ code: 'NOTE_BODY_INVALID' }) as Error,
      );
      expect(note.body).toBe('Check the supplier');
      expect(note.version).toBe(2);
    });

    it('refuses a resolved note with NOTE_RESOLVED', () => {
      note.resolve();

      expect(() => note.edit('Supplier confirmed')).toThrow(
        expect.objectContaining({
          code: 'NOTE_RESOLVED',
          message: 'Note 7 is resolved and can no longer be modified',
        }) as Error,
      );
      expect(note.version).toBe(3);
    });
  });

  describe('resolve', () => {
    it('resolves the note and bumps the version', () => {
      const note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      note.resolve();

      expect(note.resolved).toBe(true);
      expect(note.version).toBe(3);
    });

    it('refuses a resolved note with NOTE_RESOLVED', () => {
      const note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: true,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(() => note.resolve()).toThrow(
        expect.objectContaining({ code: 'NOTE_RESOLVED' }) as Error,
      );
      expect(note.version).toBe(3);
    });
  });

  describe('toSnapshot', () => {
    it('maps a stored note with its instants as ISO strings', () => {
      const note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(note.toSnapshot()).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });

  describe('payloads', () => {
    let note: NoteModel;

    beforeEach(() => {
      note = NoteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });
    });

    it('answers the row to update under the version as read', () => {
      expect(note.toUpdatePayload(2)).toEqual({
        id: '7',
        versionAsRead: 2,
        body: 'Check the supplier',
        resolved: false,
        version: 3,
      });
    });

    it('answers the revision of the edit at the version of the note', () => {
      expect(
        note.toRevisionInsertPayload({
          bodyBefore: 'Old body',
          editorId: 'admin-1',
          correlationId: 'correlation-1',
        }),
      ).toEqual({
        noteId: '7',
        noteVersion: 3,
        bodyBefore: 'Old body',
        bodyAfter: 'Check the supplier',
        editorId: 'admin-1',
        correlationId: 'correlation-1',
      });
    });

    it('answers the log fields of a creation, an edit and a resolution', () => {
      expect(note.toCreateLoggerPayload()).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        authorId: 'admin-1',
      });
      expect(note.toEditLoggerPayload()).toEqual({ id: '7', authorId: 'admin-1', version: 3 });
      expect(note.toResolveLoggerPayload()).toEqual({ id: '7', version: 3 });
    });
  });
});
