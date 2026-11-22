import { LedgerAppendInstantValue } from '../ledger-append-instant.value';

describe('LedgerAppendInstantValue', () => {
  describe('hasExplicitZone', () => {
    it.each([
      '2026-01-01T00:00:00.000Z',
      '2026-01-01T03:00:00+03:00',
      '2026-01-01T03:00:00+0300',
      '2025-12-31T19:00:00-05:00',
    ])('answers true for %s', (value) => {
      expect(LedgerAppendInstantValue.create(value).hasExplicitZone()).toBe(true);
    });

    it('answers false for a local time, which would be read in the server zone', () => {
      expect(LedgerAppendInstantValue.create('2026-01-01T00:00:00').hasExplicitZone()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('answers true for a real instant', () => {
      expect(LedgerAppendInstantValue.create('2026-01-01T00:00:00.000Z').isValid()).toBe(true);
    });

    it('answers false for a zoned value that is not a date', () => {
      expect(LedgerAppendInstantValue.create('not-a-dateZ').isValid()).toBe(false);
    });
  });

  describe('toDate', () => {
    it.each([
      ['2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'],
      ['2026-01-01T03:00:00+03:00', '2026-01-01T00:00:00.000Z'],
      ['2025-12-31T19:00:00-05:00', '2026-01-01T00:00:00.000Z'],
    ])('reads %s as the instant %s', (value, instant) => {
      expect(LedgerAppendInstantValue.create(value).toDate().toISOString()).toBe(instant);
    });
  });
});
