import type { IIdempotencyPurgeScheduleRegisterCommand } from '../types';

export interface IIdempotencyPurgeSchedulePort {
  register(command: IIdempotencyPurgeScheduleRegisterCommand): Promise<void>;
}

export const IDEMPOTENCY_PURGE_SCHEDULE_PORT = Symbol('IDEMPOTENCY_PURGE_SCHEDULE_PORT');
