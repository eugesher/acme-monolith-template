import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { LedgerGetManyQueryDto } from '../ledger-get-many.query.dto';

describe('LedgerGetManyQueryDto', () => {
  it('accepts an empty query string', () => {
    const dto = plainToInstance(LedgerGetManyQueryDto, {});

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it('turns the page window of the query string into numbers', () => {
    const dto = plainToInstance(LedgerGetManyQueryDto, { page: '2', limit: '50' });

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
    expect(dto).toEqual({ page: 2, limit: 50 });
  });

  it('accepts every filter', () => {
    const dto = plainToInstance(LedgerGetManyQueryDto, {
      subjectType: 'product',
      subjectId: '12',
      correlationId: '0b8f4f9e-4c1d-4a8e-9a57-3f1e2d6c7b90',
    });

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it('leaves a limit above 100 to the ledger, which caps it', () => {
    const dto = plainToInstance(LedgerGetManyQueryDto, { limit: '500' });

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    ['a page of zero', { page: '0' }, 'page', 'isPositive'],
    ['a page that is not a number', { page: 'first' }, 'page', 'isInt'],
    ['a fractional limit', { limit: '2.5' }, 'limit', 'isInt'],
    ['a limit of zero', { limit: '0' }, 'limit', 'isPositive'],
    ['a subject type longer than 64', { subjectType: 'x'.repeat(65) }, 'subjectType', 'maxLength'],
    ['a subject id longer than 64', { subjectId: '1'.repeat(65) }, 'subjectId', 'maxLength'],
    [
      'a correlation id longer than 64',
      { correlationId: 'c'.repeat(65) },
      'correlationId',
      'maxLength',
    ],
  ])('rejects %s', (_case, query, property, constraint) => {
    const dto = plainToInstance(LedgerGetManyQueryDto, query);

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe(property);
    expect(Object.keys(errors[0].constraints ?? {})).toContain(constraint);
  });
});
