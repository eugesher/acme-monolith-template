import { ApiIdempotencyKeyHeader } from '../api-idempotency-key-header.decorator';

describe('ApiIdempotencyKeyHeader', () => {
  it('documents the required Idempotency-Key header with its length and the codes of a refusal', () => {
    class Probe {
      @ApiIdempotencyKeyHeader()
      public handle(this: void): string {
        return 'handled';
      }
    }

    const parameters: unknown = Reflect.getMetadata(
      'swagger/apiParameters',
      Probe.prototype.handle,
    );

    expect(parameters).toEqual([
      {
        name: 'Idempotency-Key',
        in: 'header',
        required: true,
        description:
          'At most 128 characters; a missing key answers IDEMPOTENCY_KEY_REQUIRED (400), a longer one IDEMPOTENCY_KEY_INVALID (400)',
        schema: { type: 'string' },
      },
    ]);
  });
});
