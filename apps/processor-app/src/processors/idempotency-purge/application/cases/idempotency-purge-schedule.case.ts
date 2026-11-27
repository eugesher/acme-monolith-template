import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  IDEMPOTENCY_PURGE_SCHEDULE_PORT,
  type IIdempotencyPurgeSchedulePort,
} from '../../outbound';

@Injectable()
export class IdempotencyPurgeScheduleCase {
  private static readonly PATTERN = '*/5 * * * *';

  constructor(
    @Inject(IDEMPOTENCY_PURGE_SCHEDULE_PORT)
    private readonly schedule: IIdempotencyPurgeSchedulePort,
    @InjectPinoLogger(IdempotencyPurgeScheduleCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(): Promise<void> {
    const pattern = IdempotencyPurgeScheduleCase.PATTERN;

    await this.schedule.register({ pattern });

    this.logger.info({ pattern }, 'Idempotency purge scheduled');
  }
}
