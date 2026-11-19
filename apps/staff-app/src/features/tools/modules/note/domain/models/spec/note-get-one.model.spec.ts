import { NoteGetOneModel } from '../note-get-one.model';

describe('NoteGetOneModel', () => {
  describe('reconstitute', () => {
    it('restores a stored note as it was', () => {
      const note = NoteGetOneModel.reconstitute({
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

      expect(note.toSnapshot()).toMatchObject({
        id: '7',
        resolved: true,
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });

    it.each([0, 1.5])('refuses version %s with NOTE_VERSION_INVALID', (version) => {
      expect(() =>
        NoteGetOneModel.reconstitute({
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

  describe('toSnapshot', () => {
    it('maps a stored note with its instants as ISO strings', () => {
      const note = NoteGetOneModel.reconstitute({
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

  describe('assertExpectedVersion', () => {
    let note: NoteGetOneModel;

    beforeEach(() => {
      note = NoteGetOneModel.reconstitute({
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
    });

    it.each([
      ['no If-Match', undefined],
      ['the current version', 3],
    ])('accepts %s', (_, expectedVersion) => {
      expect(() => note.assertExpectedVersion(expectedVersion)).not.toThrow();
    });

    it('refuses another version with VERSION_MISMATCH and the current version', () => {
      expect(() => note.assertExpectedVersion(2)).toThrow(
        expect.objectContaining({
          code: 'VERSION_MISMATCH',
          message: 'Note 7: If-Match version 2 does not match the current version 3',
          details: { currentVersion: 3 },
        }) as Error,
      );
    });
  });
});
