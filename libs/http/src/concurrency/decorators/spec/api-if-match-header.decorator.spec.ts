import { ApiIfMatchHeader } from '../api-if-match-header.decorator';

describe('ApiIfMatchHeader', () => {
  it('documents the optional If-Match header with the code of a malformed version', () => {
    class Probe {
      @ApiIfMatchHeader()
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
        name: 'If-Match',
        in: 'header',
        required: false,
        description:
          'The version as read, for optimistic concurrency; a value that is not a non-negative integer answers IF_MATCH_INVALID (400)',
        schema: { type: 'string' },
      },
    ]);
  });
});
