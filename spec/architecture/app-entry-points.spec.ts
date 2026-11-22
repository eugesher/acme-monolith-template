import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('app entry points', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__entry-fixture__/src/app/app.module.ts',
      'apps/__entry-fixture__/src/app/setup/config/config-setup.module.ts',
      'apps/__entry-fixture__/src/app/setup/app-setup.module.ts',
      'apps/__entry-fixture__/src/app/entities/index.ts',
      'apps/__entry-fixture__/src/features/index.ts',
      'apps/__entry-fixture__/src/features/health/shell/health.module.ts',
      'apps/__entry-fixture__/src/processors/index.ts',
      'apps/__entry-fixture__/src/processors/ledger/shell/ledger.module.ts',
      'apps/__entry-fixture__/src/common/modules/index.ts',
      'apps/__entry-fixture__/src/common/modules/tag/index.ts',
      'apps/__other-entry-fixture__/src/app/app.module.ts',
      'apps/__other-entry-fixture__/src/features/index.ts',
      'core/contracts/src/__idempotency-fixture__/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/contracts/src/__product-stock-fixture__/index.ts',
      'core/modules/src/__idempotency-fixture__/index.ts',
      'core/modules/src/__ledger-fixture__/index.ts',
      'core/queues/src/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('every app alias of tsconfig points at an existing folder', () => {
    const tsconfig = JSON.parse(
      readFileSync(path.resolve(__dirname, '../../tsconfig.json'), 'utf8'),
    ) as { compilerOptions: { paths: Record<string, string[]> } };
    const missing = Object.entries(tsconfig.compilerOptions.paths)
      .filter(([alias]) => !alias.startsWith('@acme-libs/') && !alias.startsWith('@acme-core/'))
      .map(([, [target]]) => target.replace(/\/\*$/, ''))
      .filter((target) => !existsSync(path.resolve(__dirname, '../..', target)));

    expect(missing).toEqual([]);
  });

  it.each([
    ['apps/__entry-fixture__/src/app/app.module.ts', '../features/health/shell/health.module'],
    ['apps/__entry-fixture__/src/app/app.module.ts', '../processors/ledger/shell/ledger.module'],
    [
      'apps/__entry-fixture__/src/features/product/shell/__fixture__.module.ts',
      '../../../app/setup/config/config-setup.module',
    ],
    [
      'apps/__entry-fixture__/src/features/product/shell/__fixture__.module.ts',
      '../../../common/modules/tag',
    ],
  ])('%s may NOT reach a deep path: %s', async (file, source) => {
    await expect({
      file,
      code: `import { X } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([
    ['apps/__entry-fixture__/src/main.ts', './app/app.module'],
    ['apps/__entry-fixture__/test/context/__fixture__.ts', '../../src/app/app.module'],
  ])('%s MAY import the AppModule of its own app by %s', async (file, source) => {
    await expect({
      file,
      code: `import { AppModule } from "${source}";`,
    }).toPassArchitectureLint();
  });

  it.each([
    ['apps/__entry-fixture__/src/main.ts', '../../__other-entry-fixture__/src/app/app.module'],
    [
      'apps/__entry-fixture__/test/context/__fixture__.ts',
      '../../../__other-entry-fixture__/src/app/app.module',
    ],
  ])('%s may NOT import the AppModule of another app by %s', async (file, source) => {
    await expect({
      file,
      code: `import { AppModule } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([
    ['apps/__entry-fixture__/src/app/setup/config/__fixture__.ts', '../../app.module'],
    ['apps/__entry-fixture__/src/global/auth/shell/__fixture__.ts', '../../../app/app.module'],
    [
      'apps/__entry-fixture__/src/features/product/shell/product.module.ts',
      '../../../app/app.module',
    ],
    [
      'apps/__entry-fixture__/src/processors/idempotency/shell/__fixture__.module.ts',
      '../../../app/app.module',
    ],
    ['apps/__entry-fixture__/src/common/shared/ledger/__fixture__.ts', '../../../app/app.module'],
  ])('%s may NOT import the AppModule, only main and the tests do', async (file, source) => {
    await expect({
      file,
      code: `import { AppModule } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it('the AppModule may NOT import @nestjs/core, the app lib registers the global providers', async () => {
    await expect({
      file: 'apps/staff-app/src/app/app.module.ts',
      code: 'import { APP_FILTER, APP_PIPE } from "@nestjs/core";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the app setup may NOT import @nestjs/core, the app lib registers the global providers', async () => {
    await expect({
      file: 'apps/staff-app/src/app/setup/config/__fixture__.ts',
      code: 'import { APP_PIPE } from "@nestjs/core";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the AppModule MAY mount the app setup module', async () => {
    await expect({
      file: 'apps/__entry-fixture__/src/app/app.module.ts',
      code: 'import { AppSetupModule } from "./setup/app-setup.module";',
    }).toPassArchitectureLint();
  });

  it('the app setup module MAY extend the app lib and mount the credentials lib, the config setup and the entities of its app', async () => {
    await expect({
      file: 'apps/__entry-fixture__/src/app/setup/app-setup.module.ts',
      code: 'import type { DynamicModule } from "@nestjs/common";\nimport { AppSetupBaseModule } from "../../../../../libs/app/src";\nimport { CredentialsModule } from "../../../../../libs/credentials/src";\nimport { AppNameEnum } from "../../../../../libs/kernel/src";\nimport { entities } from "../entities";\nimport { ConfigSetupModule } from "./config/config-setup.module";',
    }).toPassArchitectureLint();
  });

  it.each(['cache', 'database', 'http', 'queue'])(
    'the app setup module may NOT reach the %s lib: the app lib mounts it',
    async (lib) => {
      await expect({
        file: 'apps/__entry-fixture__/src/app/setup/app-setup.module.ts',
        code: `import { x } from "../../../../../libs/${lib}/src";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each([
    [
      'apps/__entry-fixture__/src/app/setup/config/__fixture__.ts',
      '../../../../../../libs/app/src',
    ],
    [
      'apps/__entry-fixture__/src/app/setup/config/__fixture__.ts',
      '../../../../../../libs/credentials/src',
    ],
    [
      'apps/__entry-fixture__/src/features/health/shell/__fixture__.ts',
      '../../../../../../libs/app/src',
    ],
  ])('%s may NOT reach %s, only the app setup module does', async (file, source) => {
    await expect({ file, code: `import { x } from "${source}";` }).toBreakRule(
      'boundaries/dependencies',
    );
  });

  it('main may NOT reach past the AppModule into the app setup', async () => {
    await expect({
      file: 'apps/__entry-fixture__/src/main.ts',
      code: 'import { ConfigSetupModule } from "./app/setup/config/config-setup.module";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('main MAY create the app with NestFactory', async () => {
    await expect({
      file: 'apps/staff-app/src/main.ts',
      code: 'import { NestApplicationOptions } from "@nestjs/common";\nimport { NestFactory } from "@nestjs/core";',
    }).toPassArchitectureLint();
  });

  it('main may NOT take the Nest logger from nestjs-pino: the bootstrap lib sets it', async () => {
    await expect({
      file: 'apps/customer-app/src/main.ts',
      code: 'import { Logger } from "nestjs-pino";',
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([['apps/__entry-fixture__/src/app/app.module.ts', '../features']])(
    '%s MAY import the features of its own app by %s',
    async (file, source) => {
      await expect({
        file,
        code: `import { HealthModule } from "${source}";`,
      }).toPassArchitectureLint();
    },
  );

  it.each([
    [
      'apps/__entry-fixture__/src/app/app.module.ts',
      '../../../__other-entry-fixture__/src/features',
    ],
  ])('%s may NOT import the features of another app by %s', async (file, source) => {
    await expect({
      file,
      code: `import { HealthModule } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it('the AppModule MAY import the processors of its own app', async () => {
    await expect({
      file: 'apps/__entry-fixture__/src/app/app.module.ts',
      code: 'import { LedgerAppendModule } from "../processors";',
    }).toPassArchitectureLint();
  });

  it.each([
    [
      'apps/__other-entry-fixture__/src/app/app.module.ts',
      '../../../__entry-fixture__/src/processors',
    ],
    ['apps/__entry-fixture__/src/features/health/shell/health.module.ts', '../../../processors'],
    ['apps/__entry-fixture__/src/main.ts', './processors'],
  ])('%s may NOT import the processors index by %s', async (file, source) => {
    await expect({
      file,
      code: `import { LedgerAppendModule } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([
    ['apps/__entry-fixture__/src/features/health/shell/__fixture__.ts', '../..'],
    ['apps/__entry-fixture__/src/main.ts', './features'],
  ])(
    '%s may NOT import the features index by %s, only the app root wires features',
    async (file, source) => {
      await expect({
        file,
        code: `import { HealthModule } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('a feature root MAY import the health lib by its alias', async () => {
    await expect({
      file: 'apps/customer-app/src/features/health/shell/health.module.ts',
      code: 'import { HealthLibModule } from "@acme-libs/health";',
    }).toPassArchitectureLint();
  });

  it('a feature lib adapter MAY import the health lib contracts by their alias', async () => {
    await expect({
      file: 'apps/customer-app/src/features/health/infrastructure/lib-adapters/__fixture__.ts',
      code: 'import { HEALTH_PORT } from "@acme-libs/contracts/health";',
    }).toPassArchitectureLint();
  });

  it('a feature presentation may NOT import the health lib contracts', async () => {
    await expect({
      file: 'apps/customer-app/src/features/health/shell/__fixture__.ts',
      code: 'import { HEALTH_PORT } from "@acme-libs/contracts/health";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a feature presentation may NOT import the health lib root', async () => {
    await expect({
      file: 'apps/customer-app/src/features/health/shell/__fixture__.ts',
      code: 'import { HealthLibModule } from "@acme-libs/health";',
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([
    'apps/staff-app/src/features/health/shell/health.module.ts',
    'apps/customer-app/src/features/health/shell/health.module.ts',
    'apps/processor-app/src/processors/idempotency-purge/shell/idempotency-purge.module.ts',
  ])('%s MAY mount the idempotency core module by its alias', async (file) => {
    await expect({
      file,
      code: 'import { IdempotencyCoreModule } from "@acme-core/modules/__idempotency-fixture__";',
    }).toPassArchitectureLint();
  });

  it('a staff-app feature presentation MAY import the header decorators of the http lib', async () => {
    await expect({
      file: 'apps/staff-app/src/features/health/shell/__fixture__.ts',
      code: 'import { IdempotencyKey, IfMatch } from "@acme-libs/http";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/processor-app/src/processors/ledger-append/shell/ledger-append.processor.ts',
    'apps/staff-app/src/features/queue/infrastructure/queue/queue-registry.adapter.ts',
    'core/queues/src/ledger/ledger-queue.module.ts',
    'apps/staff-app/test/context/app-e2e.context.ts',
    'apps/customer-app/test/context/app-e2e.context.ts',
  ])('%s MAY import the ledger record contract of the core ledger', async (file) => {
    await expect({
      file,
      code: 'import { LEDGER_RECORD_QUEUE } from "@acme-core/contracts/__ledger-fixture__";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/queue/infrastructure/queue/queue-registry.adapter.ts',
    'core/queues/src/product-stock-post-subtract/product-stock-post-subtract-queue.module.ts',
  ])('%s MAY import the queue contract of the core product stock', async (file) => {
    await expect({
      file,
      code: 'import { PRODUCT_STOCK_POST_SUBTRACT_QUEUE } from "@acme-core/contracts/__product-stock-fixture__";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/processor-app/src/processors/ledger-append/shell/ledger-append.module.ts',
    'apps/staff-app/src/features/queue/infrastructure/queue/queue-registry.module.ts',
  ])('%s MAY register the ledger record queue through the core queues', async (file) => {
    await expect({
      file,
      code: 'import { LedgerQueueModule } from "@acme-core/queues";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/product/shell/product.module.ts',
    'apps/customer-app/src/features/auth/shell/auth.module.ts',
  ])('%s MAY mount the core ledger', async (file) => {
    await expect({
      file,
      code: 'import { LedgerCoreModule } from "@acme-core/modules/__ledger-fixture__";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/health/infrastructure/core-adapters/__fixture__.ts',
    'apps/customer-app/src/features/health/infrastructure/core-adapters/__fixture__.ts',
    'apps/processor-app/src/processors/idempotency-purge/infrastructure/core-adapters/__fixture__.ts',
  ])('%s MAY import the idempotency core contracts by their alias', async (file) => {
    await expect({
      file,
      code: 'import { IDEMPOTENCY_CORE_KEY_PORT } from "@acme-core/contracts/__idempotency-fixture__";',
    }).toPassArchitectureLint();
  });

  it.each([
    [
      'apps/staff-app/src/features/health/application/__fixture__.ts',
      '@acme-core/contracts/__idempotency-fixture__',
    ],
    [
      'apps/staff-app/src/features/health/infrastructure/core-adapters/__fixture__.ts',
      '@acme-core/modules/__idempotency-fixture__',
    ],
  ])('%s may NOT import %s', async (file, source) => {
    await expect({ file, code: `import { x } from "${source}";` }).toBreakRule(
      'boundaries/dependencies',
    );
  });

  it.each([
    [
      'apps/__other-entry-fixture__/src/features/health/shell/health.module.ts',
      '../../../../../__entry-fixture__/src/common/modules',
    ],
    [
      'apps/__other-entry-fixture__/src/features/health/shell/__fixture__.ts',
      '../../../../../__entry-fixture__/src/common/modules',
    ],
    [
      'apps/__other-entry-fixture__/src/app/app.module.ts',
      '../../../__entry-fixture__/src/common/modules',
    ],
  ])('%s may NOT reach the common modules of another app by %s', async (file, source) => {
    await expect({ file, code: `import { x } from "${source}";` }).toBreakRule(
      'boundaries/dependencies',
    );
  });
});
