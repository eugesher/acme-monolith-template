import { Entity } from '../entity';

describe('Entity', () => {
  describe('id', () => {
    it('returns the id it was created with', () => {
      class ItemEntity extends Entity<number> {
        public constructor(id: number) {
          super(id);
        }
      }

      const item = new ItemEntity(7);

      expect(item.id).toBe(7);
    });
  });
});
