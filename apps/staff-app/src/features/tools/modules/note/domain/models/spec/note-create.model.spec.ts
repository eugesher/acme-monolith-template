import { NoteCreateModel } from '../note-create.model';

describe('NoteCreateModel', () => {
  describe('initCandidate', () => {
    it('initializes an unresolved note candidate at version 1 with a trimmed subject id and body', () => {
      const candidate = NoteCreateModel.initCandidate({
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
      const candidate = NoteCreateModel.initCandidate({
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
    ])('refuses a subject type with %s with NOTE_SUBJECT_INVALID', (_case, subjectType) => {
      expect(() =>
        NoteCreateModel.initCandidate({
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
      const candidate = NoteCreateModel.initCandidate({
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
    ])('refuses %s with NOTE_SUBJECT_INVALID', (_case, subjectId) => {
      expect(() =>
        NoteCreateModel.initCandidate({
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
      const candidate = NoteCreateModel.initCandidate({
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
    ])('refuses %s with NOTE_BODY_INVALID', (_case, body) => {
      expect(() =>
        NoteCreateModel.initCandidate({
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

  describe('toLoggerPayload', () => {
    it('answers the id, the subject and the author of the created note', () => {
      const note = NoteCreateModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(note.toLoggerPayload()).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        authorId: 'admin-1',
      });
    });
  });
});
