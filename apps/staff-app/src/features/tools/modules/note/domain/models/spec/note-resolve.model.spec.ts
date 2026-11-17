import { NoteResolveModel } from '../note-resolve.model';

describe('NoteResolveModel', () => {
  describe('resolve', () => {
    it('resolves the note and bumps the version', () => {
      const note = NoteResolveModel.reconstitute({
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

      expect(note.toSnapshot().resolved).toBe(true);
      expect(note.version).toBe(3);
    });

    it('refuses a resolved note with NOTE_RESOLVED', () => {
      const note = NoteResolveModel.reconstitute({
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

  describe('toLoggerPayload', () => {
    it('answers the id and the version of the resolved note', () => {
      const note = NoteResolveModel.reconstitute({
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

      expect(note.toLoggerPayload()).toEqual({ id: '7', version: 3 });
    });
  });
});
