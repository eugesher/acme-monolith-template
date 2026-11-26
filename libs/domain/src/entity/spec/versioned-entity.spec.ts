import { VersionedEntity } from '../versioned-entity';

describe('VersionedEntity', () => {
  describe('version', () => {
    it('answers the version it was built with', () => {
      class ItemEntity extends VersionedEntity {
        constructor() {
          super('item-1', 3);
        }
      }

      expect(new ItemEntity().version).toBe(3);
    });
  });

  describe('isValidVersion', () => {
    it('accepts a positive integer', () => {
      expect(VersionedEntity.isValidVersion(1)).toBe(true);
    });

    it.each([
      ['zero', 0],
      ['a negative number', -1],
      ['a fraction', 1.5],
    ])('refuses %s', (_case, version) => {
      expect(VersionedEntity.isValidVersion(version)).toBe(false);
    });
  });

  describe('isExpectedVersion', () => {
    it.each([
      ['no expectation', undefined, true],
      ['the current version', 3, true],
      ['another version', 2, false],
    ])('answers %s with %s', (_case, expectedVersion, isExpected) => {
      class ItemEntity extends VersionedEntity {
        constructor() {
          super('item-1', 3);
        }
      }

      expect(new ItemEntity().isExpectedVersion(expectedVersion)).toBe(isExpected);
    });
  });

  describe('bumpVersion', () => {
    it('raises the version by one', () => {
      class ItemEntity extends VersionedEntity {
        constructor() {
          super('item-1', 3);
        }

        public change(): void {
          this.bumpVersion();
        }
      }

      const item = new ItemEntity();

      item.change();

      expect(item.version).toBe(4);
    });
  });
});
