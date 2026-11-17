import { TagNameInvalidException } from '../../exceptions/tag-name-invalid.exception';
import { TagModel } from '../tag.model';

describe('TagModel', () => {
  describe('initCandidate', () => {
    it('initializes a tag candidate with the trimmed name', () => {
      const candidate = TagModel.initCandidate({ name: '  fragile  ' });

      expect(candidate).toEqual({ name: 'fragile' });
    });

    it.each([
      ['an empty name', ''],
      ['a name of spaces', '   '],
      ['a name of 65 characters', 'a'.repeat(65)],
    ])('rejects %s', (_case, name) => {
      expect(() => TagModel.initCandidate({ name })).toThrow(TagNameInvalidException);
    });

    it('accepts a name of 64 characters', () => {
      const candidate = TagModel.initCandidate({ name: 'a'.repeat(64) });

      expect(candidate).toEqual({ name: 'a'.repeat(64) });
    });
  });

  describe('reconstitute', () => {
    it('answers the view of the stored tag', () => {
      const tag = TagModel.reconstitute({
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

  describe('rename', () => {
    it('takes the trimmed new name', () => {
      const tag = TagModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      tag.rename(' handle-with-care ');

      expect(tag.name).toBe('handle-with-care');
    });

    it('keeps the old name when the new one is invalid', () => {
      const tag = TagModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(() => tag.rename(' ')).toThrow(TagNameInvalidException);
      expect(tag.name).toBe('fragile');
    });
  });

  describe('payloads', () => {
    it('answers the row to update and the log fields of a creation, a rename and a deletion', () => {
      const tag = TagModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(tag.toUpdateQuery()).toEqual({ id: '300', name: 'fragile' });
      expect(tag.toCreateLoggerPayload()).toEqual({ id: '300', name: 'fragile' });
      expect(tag.toRenameLoggerPayload()).toEqual({ id: '300', name: 'fragile' });
      expect(tag.toDeleteLoggerPayload()).toEqual({ id: '300' });
    });
  });
});
