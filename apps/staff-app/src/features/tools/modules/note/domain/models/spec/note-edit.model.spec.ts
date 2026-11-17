import { NoteEditModel } from '../note-edit.model';

describe('NoteEditModel', () => {
  describe('edit', () => {
    let note: NoteEditModel;

    beforeEach(() => {
      note = NoteEditModel.reconstitute({
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
      const resolvedNote = NoteEditModel.reconstitute({
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

      expect(() => resolvedNote.edit('Supplier confirmed')).toThrow(
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
      const note = NoteEditModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
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
        body: 'Check the supplier',
        resolved: false,
        version: 3,
      });
    });
  });

  describe('toRevisionInsertPayload', () => {
    it('answers the revision of the edit at the version of the note', () => {
      const note = NoteEditModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

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
  });

  describe('toLoggerPayload', () => {
    it('answers the id, the author and the version of the edited note', () => {
      const note = NoteEditModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
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
