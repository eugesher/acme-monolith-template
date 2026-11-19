import { DomainException } from '../domain.exception';

describe('DomainException', () => {
  it('is an Error named after the concrete subclass', () => {
    class ItemArchivedException extends DomainException {
      public readonly code = 'ITEM_ARCHIVED';

      constructor() {
        super('item is archived');
      }
    }

    const exception = new ItemArchivedException();

    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.name).toBe('ItemArchivedException');
    expect(exception.message).toBe('item is archived');
    expect(exception.code).toBe('ITEM_ARCHIVED');
    expect(exception.details).toBeUndefined();
  });

  it('carries the details of the refusal', () => {
    class ItemVersionMismatchException extends DomainException {
      public readonly code = 'VERSION_MISMATCH';

      constructor() {
        super('item version mismatch', { currentVersion: 4 });
      }
    }

    const exception = new ItemVersionMismatchException();

    expect(exception.details).toEqual({ currentVersion: 4 });
  });
});
