import { Injectable, Module, type OnApplicationShutdown } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NodeSDK } from '@opentelemetry/sdk-node';

import { TracerSetupModule } from '../tracer-setup.module';

describe('TracerSetupModule', () => {
  afterEach(() => {
    TracerSetupModule.track(null);
  });

  it('shuts the SDK down after the shutdown hooks of the modules of the app', async () => {
    const closed: string[] = [];

    @Injectable()
    class QueueFixture implements OnApplicationShutdown {
      public async onApplicationShutdown(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 20));

        closed.push('queue');
      }
    }

    @Module({ providers: [QueueFixture] })
    class QueueFixtureModule {}

    @Module({ imports: [QueueFixtureModule] })
    class FeatureFixtureModule {}

    @Module({ imports: [TracerSetupModule.forRoot(), FeatureFixtureModule] })
    class TestModule {}

    const shutdown = jest.fn(() => {
      closed.push('tracer');

      return Promise.resolve();
    });

    TracerSetupModule.track({ shutdown } as unknown as NodeSDK);

    const context = await NestFactory.createApplicationContext(TestModule, { logger: false });

    await context.close();

    expect(closed).toEqual(['queue', 'tracer']);
  });

  it('shuts the SDK down once', async () => {
    const shutdown = jest.fn().mockResolvedValue(undefined);
    const tracerModule = new TracerSetupModule();

    TracerSetupModule.track({ shutdown } as unknown as NodeSDK);

    await tracerModule.onApplicationShutdown();
    await tracerModule.onApplicationShutdown();

    expect(shutdown).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the tracer did not start', async () => {
    const tracerModule = new TracerSetupModule();

    TracerSetupModule.track(null);

    await expect(tracerModule.onApplicationShutdown()).resolves.toBeUndefined();
  });

  it('hands a failed shutdown to Nest, which logs it', async () => {
    const shutdown = jest.fn().mockRejectedValue(new Error('collector down'));
    const tracerModule = new TracerSetupModule();

    TracerSetupModule.track({ shutdown } as unknown as NodeSDK);

    await expect(tracerModule.onApplicationShutdown()).rejects.toThrow('collector down');
  });
});
