import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import type { INestApplication } from '@nestjs/common';

import { AppNameEnum } from '@acme-libs/kernel';
import { ApiReference } from '@acme-libs/openapi';

import { AppBootstrap } from '../app-bootstrap';

describe('AppBootstrap', () => {
  let calls: unknown[][];
  let log: jest.Mock;
  let logger: { log: jest.Mock };
  let app: {
    get: jest.Mock;
    useLogger: jest.Mock;
    setGlobalPrefix: jest.Mock;
    enableShutdownHooks: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    calls = [];
    log = jest.fn((...args: unknown[]) => calls.push(['log', ...args]));
    logger = { log };
    app = {
      get: jest.fn((token: unknown) =>
        new Map<unknown, unknown>([
          [
            ConfigService,
            { getOrThrow: (key: string) => ({ PORT: 3000, API_PREFIX: 'api' })[key] },
          ],
          [Logger, logger],
        ]).get(token),
      ),
      useLogger: jest.fn((...args: unknown[]) => calls.push(['useLogger', ...args])),
      setGlobalPrefix: jest.fn((...args: unknown[]) => calls.push(['setGlobalPrefix', ...args])),
      enableShutdownHooks: jest.fn(() => calls.push(['enableShutdownHooks'])),
      listen: jest.fn(async (...args: unknown[]) => {
        calls.push(['listen', ...args]);
        await Promise.resolve();
      }),
    };
    jest.spyOn(ApiReference, 'setup').mockImplementation((...args) => {
      calls.push(['ApiReference.setup', ...args]);
    });
  });

  describe('execute', () => {
    it('sets the logger and the prefix before the API reference and listen, then logs the port', async () => {
      const bootstrap = AppBootstrap.create(
        app as unknown as INestApplication,
        AppNameEnum.STAFF_APP,
      );

      await bootstrap.execute();

      expect(calls).toEqual([
        ['useLogger', logger],
        ['setGlobalPrefix', 'api'],
        ['enableShutdownHooks'],
        ['ApiReference.setup', app, 'staff-app'],
        ['listen', 3000],
        ['log', 'staff-app is listening on port 3000', 'AppBootstrap'],
      ]);
    });

    it('rejects without the port line when listen fails', async () => {
      const failure = new Error('listen EADDRINUSE');
      app.listen.mockRejectedValue(failure);
      const bootstrap = AppBootstrap.create(
        app as unknown as INestApplication,
        AppNameEnum.PROCESSOR_APP,
      );

      await expect(bootstrap.execute()).rejects.toBe(failure);

      expect(log).not.toHaveBeenCalled();
    });
  });
});
