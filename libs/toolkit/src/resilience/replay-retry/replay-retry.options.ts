import type { IHelperLogger } from '../../types/helper-logger.interface';

export interface IReplayRetryOptions {
  maxAttempts: number;
  logger: IHelperLogger;
  correlationId: string;
  label: string;
  context: object;
  replayMessage: string;
}
