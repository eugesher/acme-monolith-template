export interface IJobFailureLogger {
  warn(context: Record<string, unknown>, message: string): void;
  error(context: Record<string, unknown>, message: string): void;
}

export interface IJobFailureOptions {
  logger: IJobFailureLogger;
  label: string;
  context: object;
  attempt: number;
  attempts: number;
  error: Error;
}
