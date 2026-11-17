import { TagDeleteModel } from '../tag-delete.model';

describe('TagDeleteModel', () => {
  describe('toLoggerPayload', () => {
    it('answers the id of the deleted tag', () => {
      const tag = TagDeleteModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(tag.toLoggerPayload()).toEqual({ id: '300' });
    });
  });
});
