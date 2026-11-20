import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { QueueNameParamDto } from '../queue-name.param.dto';

describe('QueueNameParamDto', () => {
  it.each([
    ['the name of a queue', 'ledger-record'],
    ['a name of 64 characters', 'q'.repeat(64)],
  ])('accepts %s', (_case, queueName) => {
    const dto = plainToInstance(QueueNameParamDto, { queueName });

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    ['a name of 65 characters', { queueName: 'q'.repeat(65) }, ['maxLength']],
    ['a missing name', {}, ['maxLength', 'isString']],
  ])('rejects %s', (_case, params, constraints) => {
    const dto = plainToInstance(QueueNameParamDto, params);

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('queueName');
    expect(Object.keys(errors[0].constraints ?? {})).toEqual(constraints);
  });
});
