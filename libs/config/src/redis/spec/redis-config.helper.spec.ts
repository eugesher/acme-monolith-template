import fs from 'fs';
import type { ConfigService } from '@nestjs/config';

import { RedisConfigHelper } from '../redis-config.helper';

describe('RedisConfigHelper', () => {
  let values: Record<string, unknown>;
  let config: ConfigService;

  beforeEach(() => {
    values = {
      REDIS_HOST: 'redis.example.com',
      REDIS_PORT: 6380,
      REDIS_PASSWORD: 'password',
      REDIS_TLS_CA: '',
      REDIS_COMMAND_TIMEOUT_MS: 500,
    };
    config = { getOrThrow: (key: string) => values[key] } as unknown as ConfigService;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('connection', () => {
    it('answers the address and the password of REDIS_* without TLS for an empty REDIS_TLS_CA', () => {
      const connection = RedisConfigHelper.connection(config);

      expect(connection).toEqual({
        host: 'redis.example.com',
        port: 6380,
        password: 'password',
        tls: undefined,
      });
    });

    it('connects over TLS with the certificate authority of REDIS_TLS_CA', () => {
      const readFileSync = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('-----BEGIN CERTIFICATE-----');

      values.REDIS_TLS_CA = '/run/secrets/redis-ca.pem';

      const connection = RedisConfigHelper.connection(config);

      expect(connection.tls).toEqual({ ca: '-----BEGIN CERTIFICATE-----' });
      expect(readFileSync).toHaveBeenCalledWith('/run/secrets/redis-ca.pem', 'utf8');
    });
  });

  describe('failFast', () => {
    it('adds no offline queue and the command timeout of REDIS_COMMAND_TIMEOUT_MS', () => {
      const connection = RedisConfigHelper.failFast(config);

      expect(connection).toEqual({
        host: 'redis.example.com',
        port: 6380,
        password: 'password',
        tls: undefined,
        enableOfflineQueue: false,
        commandTimeout: 500,
      });
    });
  });
});
