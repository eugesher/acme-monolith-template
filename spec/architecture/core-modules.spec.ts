import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('core modules', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'core/modules/src/__ledger-fixture__/index.ts',
      'core/modules/src/__ledger-fixture__/shell/ledger.module.ts',
      'core/modules/src/__ledger-fixture__/shell/ledger-core.facade.ts',
      'core/modules/src/__ledger-fixture__/domain/index.ts',
      'core/modules/src/__ledger-fixture__/outbound/index.ts',
      'core/modules/src/__ledger-fixture__/application/index.ts',
      'core/modules/src/__ledger-fixture__/infrastructure/index.ts',
      'core/modules/src/__ledger-fixture__/infrastructure/cache/ledger-core-cache.adapter.ts',
      'core/modules/src/__ledger-fixture__/infrastructure/core-adapters/ledger-core-identity-core.adapter.ts',
      'core/modules/src/__identity-fixture__/index.ts',
      'core/modules/src/__identity-fixture__/application/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/contracts/src/__identity-fixture__/index.ts',
      'core/entities/src/index.ts',
      'apps/__core-fixture__/src/features/product/index.ts',
      'libs/cache/src/index.ts',
      'libs/kernel/src/index.ts',
      'apps/__core-fixture__/src/contracts/auth/index.ts',
      'apps/__core-fixture__/src/common/modules/index.ts',
      'core/contracts/src/__product-fixture__/index.ts',
      'core/queues/src/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  describe('isolation and contracts', () => {
    it('core application may NOT reach another core module', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
        code: 'import { x } from "../../__identity-fixture__/application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a core module MAY reach its own contracts', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('core application may NOT reach the contracts of another module — a core-adapter does', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/src/__identity-fixture__";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a core-adapter MAY reach the contracts of another core module and its own outbound', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { Injectable } from "@nestjs/common";\nimport { x } from "../../../../../contracts/src/__identity-fixture__";\nimport { y } from "../../outbound";',
      }).toPassArchitectureLint();
    });

    it.each(['../../domain', '../../application', '../../../__identity-fixture__/application'])(
      'a core-adapter may NOT reach %s',
      async (source) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/infrastructure/core-adapters/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('core infrastructure MAY bind its core-adapters', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
        code: 'import { x } from "./core-adapters/ledger-core-identity-core.adapter";',
      }).toPassArchitectureLint();
    });

    it('the module root MAY mount another core module through its barrel', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { x } from "../../__identity-fixture__";',
      }).toPassArchitectureLint();
    });

    it('the module root may NOT reach the layers of another core module', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { x } from "../../__identity-fixture__/application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      ['the contracts of an app', '../../../../../../apps/__core-fixture__/src/contracts/auth'],
      [
        'the common modules of an app',
        '../../../../../../apps/__core-fixture__/src/common/modules',
      ],
    ])(
      'ledger may NOT reach %s — the journal records facts, it never asks who the user is',
      async (_, source) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/application/use-cases/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('a core module MAY reach its own contracts through the alias', async () => {
      await expect({
        file: 'core/modules/src/__product-fixture__/application/use-cases/__fixture__.ts',
        code: 'import { PRODUCT_CORE_PORT } from "@acme-core/contracts/__product-fixture__";',
      }).toPassArchitectureLint();
    });

    it('core outbound MAY reach its own contracts: a queue command carries the record of the contract', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/outbound/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('core outbound may NOT reach the contracts of another module', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/outbound/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/src/__identity-fixture__";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('core outbound may NOT reach domain — a port speaks its own types', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/outbound/__fixture__.ts',
        code: 'import { x } from "../domain";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('core application may NOT reach its own infrastructure', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
        code: 'import { x } from "../infrastructure";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a core module may NOT import an app', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
        code: 'import { x } from "../../../../../apps/__core-fixture__/src/features/product";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('core contracts may NOT reach core modules', async () => {
      await expect({
        file: 'core/contracts/src/__ledger-fixture__/__fixture__.ts',
        code: 'import { x } from "../../../modules/src/__ledger-fixture__";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('the module barrel and shell/', () => {
    it('the core module barrel MAY export the nest module', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/index.ts',
        code: 'export * from "./shell/ledger.module";',
      }).toPassArchitectureLint();
    });

    it('the core module barrel may NOT export anything else', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/index.ts',
        code: 'export * from "./application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the core module root MAY import its services and layer barrels', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { x } from "./ledger-core.facade";\nimport { y } from "../infrastructure";',
      }).toPassArchitectureLint();
    });

    it('the core module root may NOT reach layer internals', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { x } from "../infrastructure/cache/ledger-core-cache.adapter";',
      }).toBreakRule('no-restricted-syntax');
    });

    it('the composition root may NOT import entities — it wires them through infrastructure', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { x } from "../../../../entities/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a facade MAY reach the application layer and its own contracts', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/ledger-core.facade.ts',
        code: 'import { x } from "../application";\nimport { y } from "../../../../contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it.each([
      '../infrastructure',
      '../../../../entities/src',
      '../../../../../libs/cache/src',
      '../../../../contracts/src/__identity-fixture__',
    ])('a facade may NOT reach %s', async (source) => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/ledger-core.facade.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    });

    it('a facade may NOT import the HTTP platform', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/ledger-core.facade.ts',
        code: 'import { x } from "@nestjs/platform-express";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('@nestjs/common', () => {
    it.each([
      'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
      'apps/__core-fixture__/src/common/modules/idempotency/shell/__fixture__.ts',
      'apps/__core-fixture__/src/processors/purge/shell/__fixture__.module.ts',
    ])('%s MAY take @nestjs/common', async (file) => {
      await expect({
        file,
        code: 'import { ClassProvider, DynamicModule, Inject, Injectable, Module } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });
  });

  describe('packages and lib contracts', () => {
    it('infrastructure MAY read tables through the repository host port', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
        code: 'import { Repository } from "typeorm";\nimport { type IOrmPort, ORM_PORT } from "@acme-libs/contracts/database";',
      }).toPassArchitectureLint();
    });

    it.each([
      '@acme-libs/database',
      '@nestjs-cls/transactional',
      '@nestjs-cls/transactional-adapter-typeorm',
    ])(
      'infrastructure may NOT import %s — a repository reads tables through ORM_PORT',
      async (source) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('infrastructure may NOT import @nestjs/typeorm — the app setup registers the entities', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
        code: 'import { TypeOrmModule } from "@nestjs/typeorm";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each(['argon2', '@nestjs/jwt'])(
      'infrastructure may NOT import %s — hashing and signing live in the credentials lib',
      async (source) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('application may NOT reach the credentials contract — the lib adapter talks to it', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/use-cases/__fixture__.ts',
        code: 'import { CREDENTIALS_PORT } from "@acme-libs/contracts/credentials";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the module root may NOT mount the credentials lib — no core module signs anyone in', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { CredentialsModule } from "@acme-libs/credentials";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a lib adapter may NOT take the credentials contract — no core module signs anyone in', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/lib-adapters/__fixture__.ts',
        code: 'import { CREDENTIALS_PORT } from "@acme-libs/contracts/credentials";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      ['domain', 'argon2'],
      ['domain', '@nestjs/jwt'],
      ['outbound', 'argon2'],
      ['application', 'argon2'],
      ['application', '@nestjs/jwt'],
      ['application', 'typeorm'],
      ['shell', 'argon2'],
      ['shell', '@nestjs/jwt'],
      ['shell', '@nestjs/typeorm'],
    ])('%s may NOT import %s, only infrastructure talks to it', async (layer, source) => {
      await expect({
        file: `core/modules/src/__ledger-fixture__/${layer}/__fixture__.ts`,
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    });

    it('application MAY take the logger', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/use-cases/__fixture__.ts',
        code: 'import { PinoLogger } from "nestjs-pino";',
      }).toPassArchitectureLint();
    });

    it('application may NOT take the transaction port, the transaction adapter of the module wraps it', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/use-cases/__fixture__.ts',
        code: 'import { TRANSACTION_PORT } from "@acme-libs/contracts/local-storage";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure/persistence/transaction MAY take the transaction port', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/persistence/transaction/__fixture__.ts',
        code: 'import { ITransactionPort, TRANSACTION_PORT } from "@acme-libs/contracts/local-storage";',
      }).toPassArchitectureLint();
    });

    it('application may NOT take the cache port, caching is an adapter behind a port', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/application/use-cases/__fixture__.ts',
        code: 'import { CACHE_PORT } from "@acme-libs/contracts/cache";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure MAY take the cache port to drop the keys a write makes stale', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/cache/__fixture__.ts',
        code: 'import { CACHE_KEYS, CACHE_PORT } from "@acme-libs/contracts/cache";',
      }).toPassArchitectureLint();
    });

    it('a queue adapter MAY take InjectQueue, the Queue type and the queue contract', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/queue/__fixture__.ts',
        code: 'import { InjectQueue } from "@nestjs/bullmq";\nimport type { Queue } from "bullmq";\nimport { X_QUEUE } from "../../../../../contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('the module of a queue adapter MAY register its queue through the core queues', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/queue/__fixture__.ts',
        code: 'import { LedgerQueueModule } from "@acme-core/queues";',
      }).toPassArchitectureLint();
    });

    it.each([
      'import { LedgerQueueModule } from "@acme-core/queues";',
      'import { BullSetupModule } from "@acme-libs/queue";',
    ])(
      'the module root may NOT register a queue itself (%s) — it mounts the module of its queue adapter',
      async (code) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
          code,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('the module root MAY mount the core ledger', async () => {
      await expect({
        file: 'core/modules/src/product/shell/__fixture__.ts',
        code: 'import { LedgerCoreModule } from "@acme-core/modules/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('a core-adapter MAY take the port of the core ledger', async () => {
      await expect({
        file: 'core/modules/src/product/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { LEDGER_CORE_PORT } from "@acme-core/contracts/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('a lib adapter may NOT take the correlation helper: the core ledger reads the correlation id itself', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/lib-adapters/__fixture__.ts',
        code: 'import { CorrelationContextHelper } from "@acme-libs/observability";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a lib adapter may NOT reach domain', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/lib-adapters/__fixture__.ts',
        code: 'import { x } from "../../domain";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      'import { BullModule } from "@nestjs/bullmq";',
      'import { Processor } from "@nestjs/bullmq";',
    ])(
      'the module root may NOT take Bull itself (%s) — it registers queues with the queue lib',
      async (code) => {
        await expect({
          file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
          code,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it.each(['application', 'outbound', 'domain'])(
      '%s may NOT import Bull, only the queue adapter writes to a queue',
      async (layer) => {
        await expect({
          file: `core/modules/src/__ledger-fixture__/${layer}/__fixture__.ts`,
          code: 'import { InjectQueue } from "@nestjs/bullmq";',
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('infrastructure/config MAY bind config values with the config lib', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/infrastructure/config/__fixture__.ts',
        code: 'import { ConfigValueProvider } from "@acme-libs/config";',
      }).toPassArchitectureLint();
    });

    it('the module root may NOT bind config values, infrastructure/config does', async () => {
      await expect({
        file: 'core/modules/src/__ledger-fixture__/shell/__fixture__.ts',
        code: 'import { ConfigValueProvider } from "@acme-libs/config";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each(['application', 'infrastructure'])(
      '%s may NOT read the config, values come in as tokens',
      async (layer) => {
        await expect({
          file: `core/modules/src/__ledger-fixture__/${layer}/__fixture__.ts`,
          code: 'import { ConfigService } from "@nestjs/config";',
        }).toBreakRule('boundaries/dependencies');
      },
    );
  });

  describe('core entities', () => {
    it('entities MAY reach the kernel lib', async () => {
      await expect({
        file: 'core/entities/src/__fixture__.ts',
        code: 'import { x } from "../../../libs/kernel/src";',
      }).toPassArchitectureLint();
    });

    it('entities may NOT reach other libs', async () => {
      await expect({
        file: 'core/entities/src/__fixture__.ts',
        code: 'import { x } from "../../../libs/cache/src";',
      }).toBreakRule('boundaries/dependencies');
    });
  });
});
