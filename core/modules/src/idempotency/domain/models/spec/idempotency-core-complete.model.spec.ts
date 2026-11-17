import { IdempotencyCoreCompleteModel } from '../idempotency-core-complete.model';

describe('IdempotencyCoreCompleteModel', () => {
  describe('toUpdatePayload', () => {
    it('answers the key with the response serialized for storage', () => {
      const completeUpdatePayload = IdempotencyCoreCompleteModel.toUpdatePayload({
        scope: 'customer:101',
        key: 'key-1',
        response: { id: '12' },
      });

      expect(completeUpdatePayload).toEqual({
        scope: 'customer:101',
        key: 'key-1',
        responseBody: '{"id":"12"}',
      });
    });
  });
});
