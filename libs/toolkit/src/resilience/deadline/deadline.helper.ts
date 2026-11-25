import type { IDeadlineOptions } from './deadline.options';

export class DeadlineHelper {
  public static async race<T>(work: () => Promise<T>, options: IDeadlineOptions): Promise<T> {
    const { timeoutMs, message } = options;
    let timer: NodeJS.Timeout | undefined;

    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    try {
      const pending = work();

      return await Promise.race([pending, deadline]);
    } finally {
      clearTimeout(timer);
    }
  }
}
