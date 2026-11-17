import { TagNameInvalidException } from '../../exceptions/tag-name-invalid.exception';
import { TagRenameModel } from '../tag-rename.model';

describe('TagRenameModel', () => {
  let tag: TagRenameModel;

  beforeEach(() => {
    tag = TagRenameModel.reconstitute({
      id: '300',
      name: 'fragile',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
  });

  describe('rename', () => {
    it('takes the trimmed new name', () => {
      tag.rename(' handle-with-care ');

      expect(tag.name).toBe('handle-with-care');
    });

    it('keeps the old name when the new one is invalid', () => {
      expect(() => tag.rename(' ')).toThrow(TagNameInvalidException);
      expect(tag.name).toBe('fragile');
    });
  });

  describe('toUpdatePayload', () => {
    it('answers the row to update with the new name', () => {
      tag.rename('handle-with-care');

      expect(tag.toUpdatePayload()).toEqual({ id: '300', name: 'handle-with-care' });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the name of the renamed tag', () => {
      expect(tag.toLoggerPayload()).toEqual({ id: '300', name: 'fragile' });
    });
  });
});
