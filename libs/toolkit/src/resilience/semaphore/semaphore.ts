import type { ISemaphoreOptions } from './semaphore.options';

export class Semaphore {
  private active = 0;
  private readonly waiting: (() => void)[] = [];

  constructor(private readonly options: ISemaphoreOptions) {}

  public async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();

    try {
      return await task();
    } finally {
      this.release();
    }
  }

  private async acquire(): Promise<void> {
    const { maxConcurrency, queueTimeoutMs, onQueueTimeout } = this.options;

    if (this.active < maxConcurrency) {
      this.active++;

      return;
    }

    await new Promise<void>((resolve, reject) => {
      const grant = (): void => {
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(() => {
        this.waiting.splice(this.waiting.indexOf(grant), 1);
        reject(onQueueTimeout());
      }, queueTimeoutMs);

      this.waiting.push(grant);
    });
  }

  private release(): void {
    const nextWaiter = this.waiting.shift();

    if (nextWaiter) {
      nextWaiter();

      return;
    }

    this.active--;
  }
}
