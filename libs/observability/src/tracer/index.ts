import { TracerHelper } from './helpers/tracer.helper';
import { TracerSetupModule } from './setup/tracer-setup.module';

const sdk = TracerHelper.start();

TracerSetupModule.track(sdk);
