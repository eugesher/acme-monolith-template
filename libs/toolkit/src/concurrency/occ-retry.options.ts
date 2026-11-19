import type { IHelperLogger } from '../types/helper-logger.interface';

export interface IOccRetryOptions<TConflict> {
  subject: string;
  logger: IHelperLogger;
  maxAttempts: number;
  isConflict: (error: unknown) => error is TConflict;
  retryContext: (conflict: TConflict) => object;
  exhaustedContext: (conflict: TConflict) => object;
  onExhausted: (conflict: TConflict, attempts: number) => never;
}
