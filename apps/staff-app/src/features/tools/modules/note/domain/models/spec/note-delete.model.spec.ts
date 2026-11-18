import { NoteDeleteModel } from '../note-delete.model';

describe('NoteDeleteModel', () => {
  describe('toLoggerPayload', () => {
    it('answers the id of the deleted note', () => {
      const note = NoteDeleteModel.reconstitute({
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

      expect(note.toLoggerPayload()).toEqual({ id: '7' });
    });
  });
});
