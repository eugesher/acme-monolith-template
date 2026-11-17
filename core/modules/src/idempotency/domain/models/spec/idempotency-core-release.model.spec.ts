import { IdempotencyCoreReleaseModel } from '../idempotency-core-release.model';

describe('IdempotencyCoreReleaseModel', () => {
  describe('toLoggerPayload', () => {
    it('answers the scope and the key', () => {
      const payload = IdempotencyCoreReleaseModel.toLoggerPayload({
        scope: 'customer:101',
        key: 'key-1',
      });

      expect(payload).toEqual({ scope: 'customer:101', idempotencyKey: 'key-1' });
    });
  });
});
