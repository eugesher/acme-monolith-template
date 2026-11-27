import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('processors (processors/<module>) — modules entered by queues', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__processors-fixture__/src/processors/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/shell/ledger-append.module.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/shell/ledger-append.processor.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/domain/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/outbound/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/queues/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/application/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/application/services/ledger-append.service.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/index.ts',
      'apps/__processors-fixture__/src/processors/purge/index.ts',
      'apps/__processors-fixture__/src/processors/purge/shell/purge.module.ts',
      'apps/__processors-fixture__/src/processors/purge/application/index.ts',
      'apps/__processors-fixture__/src/processors/digest/index.ts',
      'apps/__processors-fixture__/src/processors/digest/shell/digest.module.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/index.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/index.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/shell/digest-daily.module.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/application/index.ts',
      'apps/__processors-fixture__/src/features/product/index.ts',
      'apps/__processors-fixture__/src/features/product/shell/product.module.ts',
      'apps/__processors-fixture__/src/features/product/application/index.ts',
      'apps/__processors-fixture__/src/contracts/ledger-append/index.ts',
      'apps/__processors-fixture__/src/contracts/idempotency/index.ts',
      'apps/__processors-fixture__/src/common/modules/index.ts',
      'apps/__processors-fixture__/src/common/modules/idempotency/index.ts',
      'core/modules/src/__ledger-fixture__/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/entities/src/index.ts',
      'libs/http/src/index.ts',
      'libs/observability/src/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  describe('mounting', () => {
    it('bootstrap MAY mount processors through the processors index', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/app/shell/app.module.ts',
        code: 'import { x } from "../../processors";',
      }).toPassArchitectureLint();
    });

    it('bootstrap may NOT reach a processor past the index', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/app/shell/app.module.ts',
        code: 'import { x } from "../../processors/ledger-append";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the index MAY re-export a processor root', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/index.ts',
        code: 'export * from "./ledger-append";',
      }).toPassArchitectureLint();
    });

    it('the index may NOT re-export a layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/index.ts',
        code: 'export * from "./ledger-append/application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a file next to the index is unknown', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/__fixture__.ts',
        code: 'export const orphan = 1;',
      }).toBreakRule('boundaries/no-unknown-files');
    });
  });

  describe('the processor root', () => {
    it('MAY reach its layers and core modules', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.module.ts',
        code: 'import { x } from "../application";\nimport { y } from "./ledger-append.processor";\nimport { z } from "../../../../../../core/modules/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('may NOT import entities — it wires them through infrastructure', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../../../../core/entities/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('may NOT skip the barrel of another layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.module.ts',
        code: 'import { x } from "../application/services/ledger-append.service";',
      }).toBreakRule('no-restricted-syntax');
    });

    it('the module barrel MAY re-export its module from shell', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/index.ts',
        code: 'export * from "./shell/ledger-append.module";',
      }).toPassArchitectureLint();
    });

    it('the module barrel may NOT re-export a layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/index.ts',
        code: 'export * from "./application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor has no presentation layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/presentation/__fixture__.ts',
        code: 'export const orphan = 1;',
      }).toBreakRule('boundaries/no-unknown-files');
    });
  });

  describe('layers', () => {
    it.each(['domain', 'outbound/ports'])('%s is framework-free', async (layer) => {
      await expect({
        file: `apps/__processors-fixture__/src/processors/ledger-append/${layer}/__fixture__.ts`,
        code: 'import { Injectable } from "@nestjs/common";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('application MAY reach its own domain and outbound', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/application/services/__fixture__.ts',
        code: 'import { x } from "../../domain";\nimport { y } from "../../outbound";',
      }).toPassArchitectureLint();
    });

    it('application may NOT reach infrastructure', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/application/services/__fixture__.ts',
        code: 'import { x } from "../../infrastructure";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure/core-adapters MAY reach core contracts', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/common-adapters MAY reach app contracts', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/common-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/ledger-append";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/common-adapters MAY reach the contract of a common module', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/purge/infrastructure/common-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/idempotency";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/common-adapters MAY take @nestjs/common', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/common-adapters/__fixture__.ts',
        code: 'import { Inject, Injectable } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it.each([
      ['infrastructure/persistence', '../../../../../../../core/contracts/src/__ledger-fixture__'],
      ['infrastructure/persistence', '../../../../contracts/ledger-append'],
      ['application/services', '../../../../../../../core/contracts/src/__ledger-fixture__'],
    ])('%s may NOT reach %s — only the matching adapters do', async (folder, source) => {
      await expect({
        file: `apps/__processors-fixture__/src/processors/ledger-append/${folder}/__fixture__.ts`,
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure MAY read tables through the repository host port', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/persistence/__fixture__.ts',
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
          file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/persistence/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('infrastructure may NOT import @nestjs/typeorm — the app setup registers the entities', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/persistence/__fixture__.ts',
        code: 'import { TypeOrmModule } from "@nestjs/typeorm";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('processors (shell)', () => {
    it('a processor MAY reach its application and the observability lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { x } from "../application";\nimport { z } from "../../../../../../libs/observability/src";',
      }).toPassArchitectureLint();
    });

    it('a processor may NOT import crypto — the correlation id comes from the observability lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { randomUUID } from "crypto";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT reach the http lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { x } from "../../../../../../libs/http/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT take a port from its outbound — ports belong to the application', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { X_PORT } from "../outbound";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT take anything from its outbound — its queue lives in queues/', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { X_QUEUE } from "../outbound";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      'apps/__processors-fixture__/src/processors/ledger-append/shell/ledger-append.processor.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/shell/ledger-append.module.ts',
    ])('%s MAY take the queue of its module from queues/', async (file) => {
      await expect({
        file,
        code: 'import { LedgerAppendQueue } from "../queues";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY take @nestjs/common', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { Injectable } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY take OnApplicationBootstrap — the start of the app is one of its entries', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import type { OnApplicationBootstrap } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY process a queue with Processor, WorkerHost, OnWorkerEvent and the Job type', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";\nimport type { Job } from "bullmq";',
      }).toPassArchitectureLint();
    });

    it.each([
      'apps/__processors-fixture__/src/processors/ledger-append/application/__fixture__.ts',
      'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/persistence/__fixture__.ts',
      'apps/__processors-fixture__/src/features/product/presentation/__fixture__.ts',
      'apps/__processors-fixture__/src/features/product/infrastructure/persistence/__fixture__.ts',
      'apps/__processors-fixture__/src/app/setup/config/__fixture__.ts',
    ])('%s may NOT process a queue — only processors do', async (file) => {
      await expect({
        file,
        code: 'import { Processor } from "@nestjs/bullmq";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor infrastructure/queue MAY take InjectQueue and the Queue type, to manage the jobs of its queue', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/queue/__fixture__.ts',
        code: 'import { InjectQueue } from "@nestjs/bullmq";\nimport type { Queue } from "bullmq";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/queue may NOT register a queue with the queue lib — queues/ does', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/queue/__fixture__.ts',
        code: 'import { BullSetupModule } from "@acme-libs/queue";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor MAY take the name of a core queue for Processor', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { LedgerAppendQueue } from "@acme-core/queues";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/queue MAY take the queue of its module from queues/', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/infrastructure/queue/__fixture__.ts',
        code: 'import { LedgerAppendQueue } from "../../queues";',
      }).toPassArchitectureLint();
    });

    it('queues/ MAY register its queue with the queue lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/queues/definitions/__fixture__.ts',
        code: 'import type { DynamicModule } from "@nestjs/common";\nimport { BullSetupModule } from "@acme-libs/queue";',
      }).toPassArchitectureLint();
    });

    it.each([
      ['its outbound', 'import { X } from "../../outbound";'],
      ['its application', 'import { X } from "../../application";'],
      ['Bull itself', 'import { BullModule } from "@nestjs/bullmq";'],
    ])('queues/ may NOT take %s', async (_case, code) => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/queues/definitions/__fixture__.ts',
        code,
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      ['application', '../queues'],
      ['domain', '../queues'],
      ['outbound/ports', '../../queues'],
    ])(
      '%s may NOT take the queue of its module — only shell/ and infrastructure/queue do',
      async (layer, source) => {
        await expect({
          file: `apps/__processors-fixture__/src/processors/ledger-append/${layer}/__fixture__.ts`,
          code: `import { LedgerAppendQueue } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('the app module may NOT connect Bull to Redis itself, the app lib mounts the queue lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/app/shell/app.module.ts',
        code: 'import { BullSetupModule } from "@acme-libs/queue";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      'apps/__processors-fixture__/src/app/shell/app.module.ts',
      'apps/__processors-fixture__/src/app/setup/config/__fixture__.ts',
    ])('%s may NOT take Bull itself — the queue lib connects it to Redis', async (file) => {
      await expect({
        file,
        code: 'import { BullModule } from "@nestjs/bullmq";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT import the HTTP platform', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.processor.ts',
        code: 'import { x } from "@nestjs/platform-express";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('nested processors (<module>/modules/<submodule>)', () => {
    it('the submodules index MAY re-export its own submodule roots', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/digest/modules/index.ts',
        code: 'export * from "./digest-daily";',
      }).toPassArchitectureLint();
    });

    it('the submodules index may NOT re-export a submodule layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/digest/modules/index.ts',
        code: 'export * from "./digest-daily/application";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('isolation', () => {
    it('a processor may NOT reach another processor', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/application/__fixture__.ts',
        code: 'import { x } from "../../purge/application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT reach a feature', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-append/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../features/product";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a feature may NOT reach a processor', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/features/product/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../processors/ledger-append";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('another app may NOT mount these processors', async () => {
      await expect({
        file: 'apps/__processors-other-fixture__/src/app/shell/app.module.ts',
        code: 'import { x } from "../../../../__processors-fixture__/src/processors";',
      }).toBreakRule('boundaries/dependencies');
    });
  });
});
