import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { QueueJobParamDto } from '../queue-job.param.dto';

describe('QueueJobParamDto', () => {
  it.each([
    ['the name of a queue and the id of a job', { queueName: 'ledger-record', jobId: '42' }],
    [
      'a name of 64 characters and an id of 128',
      { queueName: 'q'.repeat(64), jobId: '4'.repeat(128) },
    ],
  ])('accepts %s', (_case, params) => {
    const dto = plainToInstance(QueueJobParamDto, params);

    const errors = validateSync(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    [
      'a name of 65 characters',
      { queueName: 'q'.repeat(65), jobId: '42' },
      'queueName',
      ['maxLength'],
    ],
    [
      'an id of 129 characters',
      { queueName: 'ledger-record', jobId: '4'.repeat(129) },
      'jobId',
      ['maxLength'],
    ],
    ['a missing id', { queueName: 'ledger-record' }, 'jobId', ['maxLength', 'isString']],
  ])('rejects %s', (_case, params, property, constraints) => {
    const dto = plainToInstance(QueueJobParamDto, params);

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe(property);
    expect(Object.keys(errors[0].constraints ?? {})).toEqual(constraints);
  });
});
