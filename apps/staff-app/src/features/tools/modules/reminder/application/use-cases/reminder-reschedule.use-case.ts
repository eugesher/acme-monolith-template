import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ReminderRescheduleModel } from '../../domain';
import { REMINDER_SUMMARY_PORT, type IReminderSummaryPort } from '../../outbound';
import { ReminderWriteService } from '../services/reminder-write.service';
import type { IReminderRescheduleCommand, IReminderView } from '../interfaces';

@Injectable()
export class ReminderRescheduleUseCase {
  constructor(
    private readonly writeService: ReminderWriteService,
    @Inject(REMINDER_SUMMARY_PORT)
    private readonly summary: IReminderSummaryPort,
    @InjectPinoLogger(ReminderRescheduleUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IReminderRescheduleCommand): Promise<IReminderView> {
    const { reminderId, ownerId, dueOn } = command;
    const writtenReminder = await this.writeService.write(
      { reminderId, ownerId },
      ReminderRescheduleModel.reconstitute,
      (reminder) => reminder.reschedule(dueOn),
    );

    await this.summary.invalidate(ownerId);

    const reminderLoggerPayload = writtenReminder.toLoggerPayload();

    this.logger.info(reminderLoggerPayload, 'Reminder rescheduled');

    return writtenReminder.toSnapshot();
  }
}
