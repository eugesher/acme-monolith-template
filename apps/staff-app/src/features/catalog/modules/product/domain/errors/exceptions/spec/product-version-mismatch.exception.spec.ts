import { ProductVersionMismatchException } from '../product-version-mismatch.exception';

describe('ProductVersionMismatchException', () => {
  it('names the product, the If-Match version and the current version by default', () => {
    const exception = new ProductVersionMismatchException('7', 3, 4);

    expect(exception.code).toBe('VERSION_MISMATCH');
    expect(exception.message).toBe(
      'Product 7: If-Match version 3 does not match the current version 4',
    );
    expect(exception.details).toEqual({ currentVersion: 4 });
  });

  it('keeps the message the caller passes', () => {
    const exception = new ProductVersionMismatchException('7', 3, 4, 'Product 7 changed');

    expect(exception.message).toBe('Product 7 changed');
    expect(exception.details).toEqual({ currentVersion: 4 });
  });
});
