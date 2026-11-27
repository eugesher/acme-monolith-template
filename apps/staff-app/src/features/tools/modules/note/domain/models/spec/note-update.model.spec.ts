import { NoteUpdateModel } from '../note-update.model';

describe('NoteUpdateModel', () => {
  describe('update', () => {
    let note: NoteUpdateModel;

    beforeEach(() => {
      note = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it('replaces the body with the trimmed one, bumps the version and answers true', () => {
      const isUpdated = note.update('  Supplier confirmed  ', undefined);

      expect(isUpdated).toBe(true);
      expect(note.toSnapshot().body).toBe('Supplier confirmed');
      expect(note.version).toBe(3);
    });

    it('changes nothing and answers false when the trimmed body is the current one', () => {
      const isUpdated = note.update('  Check the supplier ', undefined);

      expect(isUpdated).toBe(false);
      expect(note.toSnapshot().body).toBe('Check the supplier');
      expect(note.version).toBe(2);
    });

    it('refuses a blank body with NOTE_BODY_INVALID and keeps the note', () => {
      expect(() => note.update('   ', undefined)).toThrow(
        expect.objectContaining({ code: 'NOTE_BODY_INVALID' }) as Error,
      );
      expect(note.toSnapshot().body).toBe('Check the supplier');
      expect(note.version).toBe(2);
    });

    it.each([
      ['left out', undefined],
      ['empty', ''],
      ['blank', '   '],
    ])('keeps the title when it is %s, even if the body changes', (_case, title) => {
      const isUpdated = note.update('Supplier confirmed', title);

      expect(isUpdated).toBe(true);
      expect(note.toSnapshot()).toEqual(
        expect.objectContaining({ title: 'Customer call', body: 'Supplier confirmed' }),
      );
    });

    it('changes nothing and answers false for a blank title and the current body', () => {
      const isUpdated = note.update('Check the supplier', '   ');

      expect(isUpdated).toBe(false);
      expect(note.version).toBe(2);
    });

    it('replaces the title with the trimmed one when given, without touching the body', () => {
      const isUpdated = note.update('Check the supplier', '  Supplier call  ');

      expect(isUpdated).toBe(true);
      expect(note.toSnapshot()).toEqual(
        expect.objectContaining({ title: 'Supplier call', body: 'Check the supplier' }),
      );
      expect(note.version).toBe(3);
    });

    it('changes nothing and answers false when the given title and the body are the current ones', () => {
      const isUpdated = note.update('Check the supplier', ' Customer call ');

      expect(isUpdated).toBe(false);
      expect(note.version).toBe(2);
    });

    it('refuses a title longer than 100 with NOTE_TITLE_INVALID and keeps the note', () => {
      expect(() => note.update('Supplier confirmed', 't'.repeat(101))).toThrow(
        expect.objectContaining({ code: 'NOTE_TITLE_INVALID' }) as Error,
      );
      expect(note.toSnapshot()).toEqual(
        expect.objectContaining({ title: 'Customer call', body: 'Check the supplier' }),
      );
      expect(note.version).toBe(2);
    });

    it('refuses a resolved note with NOTE_RESOLVED', () => {
      const resolvedNote = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: true,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(() => resolvedNote.update('Supplier confirmed', undefined)).toThrow(
        expect.objectContaining({
          code: 'NOTE_RESOLVED',
          message: 'Note 7 is resolved and can no longer be modified',
        }) as Error,
      );
      expect(resolvedNote.version).toBe(3);
    });
  });

  describe('toUpdatePayload', () => {
    it('answers the row to update under the version as read', () => {
      const note = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(note.toUpdatePayload(2)).toEqual({
        id: '7',
        versionAsRead: 2,
        title: 'Customer call',
        body: 'Check the supplier',
        resolved: false,
        version: 3,
      });
    });
  });

  describe('toRevisionInsertPayload', () => {
    it('answers the revision of the update: the title and the body as read, the new ones and the new version', () => {
      const note = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      note.update('Supplier confirmed', undefined);

      expect(
        note.toRevisionInsertPayload({ editorId: 'admin-1', correlationId: 'correlation-1' }),
      ).toEqual({
        noteId: '7',
        noteVersion: 4,
        titleBefore: 'Customer call',
        titleAfter: 'Customer call',
        bodyBefore: 'Check the supplier',
        bodyAfter: 'Supplier confirmed',
        editorId: 'admin-1',
        correlationId: 'correlation-1',
      });
    });

    it('records the title as read and the new title when the update renames the note', () => {
      const note = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      note.update('Check the supplier', 'Supplier call');

      expect(
        note.toRevisionInsertPayload({ editorId: 'admin-1', correlationId: 'correlation-1' }),
      ).toEqual(
        expect.objectContaining({
          noteVersion: 4,
          titleBefore: 'Customer call',
          titleAfter: 'Supplier call',
          bodyBefore: 'Check the supplier',
          bodyAfter: 'Check the supplier',
        }),
      );
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id, the author and the version of the updated note', () => {
      const note = NoteUpdateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(note.toLoggerPayload()).toEqual({ id: '7', authorId: 'admin-1', version: 3 });
    });
  });
});
