import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { UserIdParamDto } from '../user-id.param.dto';

describe('UserIdParamDto', () => {
  it.each([
    ['a one-digit id', '4'],
    ['an id of 20 digits', '18446744073709551615'],
  ])('accepts %s', (_case, userId) => {
    const dto = plainToInstance(UserIdParamDto, { userId });

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    ['zero', '0'],
    ['a leading zero', '04'],
    ['a word', 'abc'],
    ['a number with a suffix', '1abc'],
    ['an id of 21 digits', '1'.repeat(21)],
  ])('rejects %s', (_case, userId) => {
    const dto = plainToInstance(UserIdParamDto, { userId });

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({ matches: 'userId must be a positive integer' });
  });
});
