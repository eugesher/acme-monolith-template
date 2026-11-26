import { TagCreateModel } from '../tag-create.model';

describe('TagCreateModel', () => {
  describe('initCandidate', () => {
    it('initializes a tag candidate with the trimmed name', () => {
      const candidate = TagCreateModel.initCandidate({ name: '  fragile  ' });

      expect(candidate).toEqual({ name: 'fragile' });
    });

    it.each([
      ['an empty name', ''],
      ['a name of spaces', '   '],
      ['a name of 65 characters', 'a'.repeat(65)],
    ])('rejects %s', (_case, name) => {
      expect(() => TagCreateModel.initCandidate({ name })).toThrow(
        expect.objectContaining({
          code: 'TAG_NAME_INVALID',
          message: 'Tag.name must be a non-empty string of at most 64 characters',
        }) as Error,
      );
    });

    it('accepts a name of 64 characters', () => {
      const candidate = TagCreateModel.initCandidate({ name: 'a'.repeat(64) });

      expect(candidate).toEqual({ name: 'a'.repeat(64) });
    });
  });

  describe('toSnapshot', () => {
    it('answers the view of the stored tag', () => {
      const tag = TagCreateModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(tag.toSnapshot()).toEqual({
        id: '300',
        name: 'fragile',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the name of the created tag', () => {
      const tag = TagCreateModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(tag.toLoggerPayload()).toEqual({ id: '300', name: 'fragile' });
    });
  });
});
