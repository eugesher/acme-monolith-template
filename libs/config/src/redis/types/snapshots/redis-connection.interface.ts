import type { Maybe } from '@acme-libs/toolkit';

export interface IRedisConnection {
  host: string;
  port: number;
  password: string;
  tls: Maybe<{ ca: string }>;
}
