import type { IJobFailureOptions } from './job-failure.options';

export class JobFailureHelper {
  public static report(options: IJobFailureOptions): void {
    const { logger, label, context, attempt, attempts, error } = options;
    const details = { err: error, ...context, attempt, attempts };

    if (attempt < attempts) {
      logger.warn(details, `${label} failed, Bull retries the job`);

      return;
    }

    logger.error(
      details,
      `${label} failed permanently: the job stays in the failed set of the queue, replay it`,
    );
  }
}
