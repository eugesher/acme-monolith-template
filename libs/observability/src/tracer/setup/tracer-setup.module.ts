import type { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import type { NodeSDK } from '@opentelemetry/sdk-node';

import type { Nullable } from '@acme-libs/toolkit';

export class TracerSetupModule implements OnApplicationShutdown {
  private static sdk: Nullable<NodeSDK> = null;

  public static forRoot(): DynamicModule {
    return { module: TracerSetupModule, global: true };
  }

  public static track(sdk: Nullable<NodeSDK>): void {
    TracerSetupModule.sdk = sdk;
  }

  public async onApplicationShutdown(): Promise<void> {
    const { sdk } = TracerSetupModule;

    if (sdk === null) {
      return;
    }

    TracerSetupModule.sdk = null;

    await sdk.shutdown();
  }
}
