import type { IRedisConnection } from './redis-connection.interface';

export interface IRedisFailFastConnection extends IRedisConnection {
  enableOfflineQueue: false;
  commandTimeout: number;
}
