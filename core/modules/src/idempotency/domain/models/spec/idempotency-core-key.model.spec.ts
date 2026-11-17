import { IdempotencyStatusEnum } from '@acme-libs/kernel';

import { IdempotencyCoreKeyModel } from '../idempotency-core-key.model';

describe('IdempotencyCoreKeyModel', () => {
  describe('reconstitute', () => {
    it('restores every field of the record, frozen', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.COMPLETED,
        responseBody: '{"id":"12"}',
      });

      expect(key).toEqual({
        requestFingerprint: 'abc',
        status: 'completed',
        responseBody: '{"id":"12"}',
      });
      expect(Object.isFrozen(key)).toBe(true);
    });
  });

  describe('initCandidate', () => {
    it('initializes an in-flight key candidate without a stored response', () => {
      const candidate = IdempotencyCoreKeyModel.initCandidate({
        scope: 'customer:101',
        key: 'key-1',
        requestFingerprint: 'abc',
      });

      expect(candidate).toEqual({
        scope: 'customer:101',
        idempotencyKey: 'key-1',
        requestFingerprint: 'abc',
        status: 'in_flight',
        responseBody: null,
      });
    });

    it('accepts a key of 128 characters', () => {
      const candidate = IdempotencyCoreKeyModel.initCandidate({
        scope: 'customer:101',
        key: 'k'.repeat(128),
        requestFingerprint: 'abc',
      });

      expect(candidate.idempotencyKey).toHaveLength(128);
    });

    it.each([
      ['an empty key', '', 'IdempotencyKey.key is required'],
      [
        'a key longer than 128',
        'k'.repeat(129),
        'IdempotencyKey.key must be at most 128 characters',
      ],
    ])('refuses %s', (_case, value, message) => {
      expect(() =>
        IdempotencyCoreKeyModel.initCandidate({
          scope: 'customer:101',
          key: value,
          requestFingerprint: 'abc',
        }),
      ).toThrow(message);
    });
  });

  describe('matches', () => {
    it('is true for the fingerprint the key was claimed with', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.IN_FLIGHT,
        responseBody: null,
      });

      expect(key.matches('abc')).toBe(true);
    });

    it('is false for another fingerprint', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.IN_FLIGHT,
        responseBody: null,
      });

      expect(key.matches('xyz')).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('is true once the key is completed with a response', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.COMPLETED,
        responseBody: '{"id":"12"}',
      });

      expect(key.isCompleted()).toBe(true);
    });

    it('is false while the key is in flight', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.IN_FLIGHT,
        responseBody: null,
      });

      expect(key.isCompleted()).toBe(false);
    });

    it('is false for a completed key that lost its response', () => {
      const key = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'abc',
        status: IdempotencyStatusEnum.COMPLETED,
        responseBody: null,
      });

      expect(key.isCompleted()).toBe(false);
    });
  });

  describe('toCompleteQuery', () => {
    it('answers the key with the response serialized for storage', () => {
      const query = IdempotencyCoreKeyModel.toCompleteQuery({
        scope: 'customer:101',
        key: 'key-1',
        response: { id: '12' },
      });

      expect(query).toEqual({ scope: 'customer:101', key: 'key-1', responseBody: '{"id":"12"}' });
    });
  });

  describe('toKeyLoggerPayload', () => {
    it('answers the scope and the key', () => {
      const payload = IdempotencyCoreKeyModel.toKeyLoggerPayload({
        scope: 'customer:101',
        key: 'key-1',
      });

      expect(payload).toEqual({ scope: 'customer:101', idempotencyKey: 'key-1' });
    });
  });

  describe('toStoredResponse', () => {
    it('answers the stored response parsed back', () => {
      const completedKey = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'fingerprint',
        status: IdempotencyStatusEnum.COMPLETED,
        responseBody: '{"id":"12"}',
      });

      expect(completedKey.toStoredResponse()).toEqual({ id: '12' });
    });

    it('answers null for a key without a stored response', () => {
      const inFlightKey = IdempotencyCoreKeyModel.reconstitute({
        requestFingerprint: 'fingerprint',
        status: IdempotencyStatusEnum.IN_FLIGHT,
        responseBody: null,
      });

      expect(inFlightKey.toStoredResponse()).toBeNull();
    });
  });
});
