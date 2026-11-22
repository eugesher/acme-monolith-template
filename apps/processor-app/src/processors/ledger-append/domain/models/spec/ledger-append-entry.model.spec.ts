import { LedgerAppendEntryModel } from '../ledger-append-entry.model';
import type { ILedgerAppendEntryCandidate } from '../../interfaces';

describe('LedgerAppendEntryModel', () => {
  describe('initCandidate', () => {
    it('trims the operation key and the action and reads the instant in UTC', () => {
      const candidate = LedgerAppendEntryModel.initCandidate({
        operationKey: '  product-archived:12 ',
        subjectType: 'product',
        subjectId: '12',
        action: ' ProductArchived ',
        payload: { previousStatus: 'active' },
        correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        occurredAt: '2026-01-01T03:00:00+03:00',
      });

      expect(candidate).toEqual({
        operationKey: 'product-archived:12',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductArchived',
        payload: { previousStatus: 'active' },
        correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        occurredAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it.each([
      [
        'a blank operation key',
        '  ',
        'ProductArchived',
        '2026-01-01T00:00:00.000Z',
        'LEDGER_APPEND_OPERATION_KEY_REQUIRED',
        'LedgerEntry.operationKey is required',
      ],
      [
        'a blank action',
        'product-archived:12',
        ' ',
        '2026-01-01T00:00:00.000Z',
        'LEDGER_APPEND_ACTION_REQUIRED',
        'LedgerEntry.action is required',
      ],
      [
        'a local time without a zone, which would be read in the server zone',
        'product-archived:12',
        'ProductArchived',
        '2026-01-01T00:00:00',
        'LEDGER_APPEND_INSTANT_INVALID',
        'occurredAt must be an ISO-8601 instant with an explicit timezone offset, got 2026-01-01T00:00:00',
      ],
      [
        'a zoned value that is not a date',
        'product-archived:12',
        'ProductArchived',
        'not-a-dateZ',
        'LEDGER_APPEND_INSTANT_INVALID',
        'occurredAt is not a valid instant: not-a-dateZ',
      ],
    ])('rejects %s with %s', (_case, operationKey, action, occurredAt, code, message) => {
      const initCandidate = (): ILedgerAppendEntryCandidate =>
        LedgerAppendEntryModel.initCandidate({
          operationKey,
          subjectType: 'product',
          subjectId: '12',
          action,
          payload: {},
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          occurredAt,
        });

      expect(initCandidate).toThrow(expect.objectContaining({ code, message }) as Error);
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the entry and the operation key of the candidate', () => {
      const candidate = LedgerAppendEntryModel.initCandidate({
        operationKey: 'product-archived:12:2',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductArchived',
        payload: {},
        correlationId: 'correlation-1',
        occurredAt: '2026-01-05T08:00:00.000Z',
      });

      expect(LedgerAppendEntryModel.toLoggerPayload('4210', candidate)).toEqual({
        id: '4210',
        operationKey: 'product-archived:12:2',
      });
    });
  });
});
