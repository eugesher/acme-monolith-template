import type { IHelperLogger } from '../../types/helper-logger.interface';

export interface IJobFailureOptions {
  logger: IHelperLogger;
  label: string;
  context: object;
  attempt: number;
  attempts: number;
  error: Error;
}
