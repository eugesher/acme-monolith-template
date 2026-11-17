import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ReminderCompleteModel } from '../../domain';
import { REMINDER_SUMMARY_PORT, type IReminderSummaryPort } from '../../outbound';
import { ReminderWriteService } from '../services/reminder-write.service';
import type { IReminderCompleteCommand, IReminderView } from '../interfaces';

@Injectable()
export class ReminderCompleteUseCase {
  constructor(
    private readonly writeService: ReminderWriteService,
    @Inject(REMINDER_SUMMARY_PORT)
    private readonly summary: IReminderSummaryPort,
    @InjectPinoLogger(ReminderCompleteUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IReminderCompleteCommand): Promise<IReminderView> {
    const { reminderId, ownerId } = command;
    const writtenReminder = await this.writeService.write(
      { reminderId, ownerId },
      ReminderCompleteModel.reconstitute,
      (reminder) => reminder.complete(),
    );

    await this.summary.invalidate(ownerId);

    const reminderLoggerPayload = writtenReminder.toLoggerPayload();

    this.logger.info(reminderLoggerPayload, 'Reminder completed');

    return writtenReminder.toSnapshot();
  }
}
