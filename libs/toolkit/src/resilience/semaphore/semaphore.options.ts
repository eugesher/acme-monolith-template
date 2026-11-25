export interface ISemaphoreOptions {
  maxConcurrency: number;
  queueTimeoutMs: number;
  onQueueTimeout: () => Error;
}
