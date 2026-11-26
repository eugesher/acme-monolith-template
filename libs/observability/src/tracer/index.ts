import type { NodeSDK } from '@opentelemetry/sdk-node';

import { TracerHelper } from './helpers/tracer.helper';
import { TracerSetupModule } from './setup/tracer-setup.module';

const sdk: NodeSDK | null = TracerHelper.start();

TracerSetupModule.track(sdk);
