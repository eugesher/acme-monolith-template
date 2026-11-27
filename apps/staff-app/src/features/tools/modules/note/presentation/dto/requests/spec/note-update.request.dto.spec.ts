import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { NoteUpdateRequestDto } from '../note-update.request.dto';

describe('NoteUpdateRequestDto', () => {
  it.each([
    ['a body of 4000 characters', { body: 'b'.repeat(4000) }],
    ['a title of 100 characters', { title: 't'.repeat(100), body: 'Refunded' }],
    ['an empty title, which keeps the title', { title: '', body: 'Refunded' }],
  ])('accepts %s', (_case, request) => {
    const dto = plainToInstance(NoteUpdateRequestDto, request);

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    ['an empty body', '', ['minLength']],
    ['a body of 4001 characters', 'b'.repeat(4001), ['maxLength']],
    ['a missing body', undefined, ['maxLength', 'minLength', 'isString']],
  ])('rejects %s', (_case, body, constraints) => {
    const dto = plainToInstance(NoteUpdateRequestDto, { body });

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('body');
    expect(Object.keys(errors[0].constraints ?? {})).toEqual(constraints);
  });

  it.each([
    ['a title of 101 characters', 't'.repeat(101), ['maxLength']],
    ['a number as the title', 42, ['maxLength', 'isString']],
  ])('rejects %s', (_case, title, constraints) => {
    const dto = plainToInstance(NoteUpdateRequestDto, { title, body: 'Refunded' });

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
    expect(Object.keys(errors[0].constraints ?? {})).toEqual(constraints);
  });
});
