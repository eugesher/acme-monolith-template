import { TagUpdateModel } from '../tag-update.model';

describe('TagUpdateModel', () => {
  let tag: TagUpdateModel;

  beforeEach(() => {
    tag = TagUpdateModel.reconstitute({
      id: '300',
      name: 'fragile',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
  });

  describe('update', () => {
    it('takes the trimmed new name', () => {
      tag.update(' handle-with-care ');

      expect(tag.name).toBe('handle-with-care');
    });

    it('keeps the old name when the new one is invalid', () => {
      expect(() => tag.update(' ')).toThrow(
        expect.objectContaining({
          code: 'TAG_NAME_INVALID',
          message: 'Tag.name must be a non-empty string of at most 64 characters',
        }) as Error,
      );
      expect(tag.name).toBe('fragile');
    });
  });

  describe('toUpdatePayload', () => {
    it('answers the row to update with the new name', () => {
      tag.update('handle-with-care');

      expect(tag.toUpdatePayload()).toEqual({ id: '300', name: 'handle-with-care' });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the name of the updated tag', () => {
      expect(tag.toLoggerPayload()).toEqual({ id: '300', name: 'fragile' });
    });
  });
});
