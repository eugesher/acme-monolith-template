import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('processors (processors/<module>) — modules entered by queues', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__processors-fixture__/src/processors/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/shell/ledger-record.module.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/shell/ledger-record.processor.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/domain/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/outbound/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/application/index.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/application/services/ledger-record.service.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/index.ts',
      'apps/__processors-fixture__/src/processors/purge/index.ts',
      'apps/__processors-fixture__/src/processors/purge/shell/purge.module.ts',
      'apps/__processors-fixture__/src/processors/purge/application/index.ts',
      'apps/__processors-fixture__/src/processors/digest/digest.module.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/index.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/index.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/shell/digest-daily.module.ts',
      'apps/__processors-fixture__/src/processors/digest/modules/digest-daily/application/index.ts',
      'apps/__processors-fixture__/src/features/product/index.ts',
      'apps/__processors-fixture__/src/features/product/shell/product.module.ts',
      'apps/__processors-fixture__/src/features/product/application/index.ts',
      'apps/__processors-fixture__/src/contracts/ledger-record/index.ts',
      'apps/__processors-fixture__/src/common/shared/ledger-record/index.ts',
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
        file: 'apps/__processors-fixture__/src/app/__fixture__.ts',
        code: 'import { x } from "../processors";',
      }).toPassArchitectureLint();
    });

    it('bootstrap may NOT reach a processor past the index', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/app/__fixture__.ts',
        code: 'import { x } from "../processors/ledger-record";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the index MAY re-export a processor root', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/index.ts',
        code: 'export * from "./ledger-record";',
      }).toPassArchitectureLint();
    });

    it('the index may NOT re-export a layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/index.ts',
        code: 'export * from "./ledger-record/application";',
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
    it('MAY reach its layers, core and common modules', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.module.ts',
        code: 'import { x } from "../application";\nimport { y } from "./ledger-record.processor";\nimport { z } from "../../../../../../core/modules/src/__ledger-fixture__";\nimport { w } from "../../../common/modules";',
      }).toPassArchitectureLint();
    });

    it('may NOT import entities — it wires them through infrastructure', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../../../../core/entities/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('may NOT skip the barrel of another layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.module.ts',
        code: 'import { x } from "../application/services/ledger-record.service";',
      }).toBreakRule('no-restricted-syntax');
    });

    it('the module barrel MAY re-export its module from shell', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/index.ts',
        code: 'export * from "./shell/ledger-record.module";',
      }).toPassArchitectureLint();
    });

    it('the module barrel may NOT re-export a layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/index.ts',
        code: 'export * from "./application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor has no presentation layer', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/presentation/__fixture__.ts',
        code: 'export const orphan = 1;',
      }).toBreakRule('boundaries/no-unknown-files');
    });
  });

  describe('layers', () => {
    it.each(['domain', 'outbound'])('%s is framework-free', async (layer) => {
      await expect({
        file: `apps/__processors-fixture__/src/processors/ledger-record/${layer}/__fixture__.ts`,
        code: 'import { Injectable } from "@nestjs/common";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('application MAY reach its own domain and outbound', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/application/services/__fixture__.ts',
        code: 'import { x } from "../../domain";\nimport { y } from "../../outbound";',
      }).toPassArchitectureLint();
    });

    it('application may NOT reach infrastructure', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/application/services/__fixture__.ts',
        code: 'import { x } from "../../infrastructure";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure/core-adapters MAY reach core contracts', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/common-adapters MAY reach app contracts', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/common-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../contracts/ledger-record";',
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
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/common-adapters/__fixture__.ts',
        code: 'import { Inject, Injectable } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it.each([
      ['infrastructure/persistence', '../../../../../../../core/contracts/src/__ledger-fixture__'],
      ['infrastructure/persistence', '../../../../contracts/ledger-record'],
      ['application/services', '../../../../../../../core/contracts/src/__ledger-fixture__'],
    ])('%s may NOT reach %s — only the matching adapters do', async (folder, source) => {
      await expect({
        file: `apps/__processors-fixture__/src/processors/ledger-record/${folder}/__fixture__.ts`,
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure MAY read tables through the repository host port', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/persistence/__fixture__.ts',
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
          file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/persistence/__fixture__.ts',
          code: `import { x } from "${source}";`,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('infrastructure may NOT import @nestjs/typeorm — the app setup registers the entities', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/persistence/__fixture__.ts',
        code: 'import { TypeOrmModule } from "@nestjs/typeorm";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('processors (shell)', () => {
    it('a processor MAY reach its application, app contracts and the observability lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { x } from "../application";\nimport { y } from "../../../contracts/ledger-record";\nimport { z } from "../../../../../../libs/observability/src";',
      }).toPassArchitectureLint();
    });

    it('a processor may NOT import crypto — the correlation id comes from the observability lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { randomUUID } from "crypto";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT reach the http lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { x } from "../../../../../../libs/http/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT take a port from its outbound — ports belong to the application', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { X_PORT } from "../outbound";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor MAY take the name of its queue from its outbound', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { X_QUEUE } from "../outbound";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY take @nestjs/common', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { Injectable } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY take OnApplicationBootstrap — the start of the app is one of its entries', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import type { OnApplicationBootstrap } from "@nestjs/common";',
      }).toPassArchitectureLint();
    });

    it('a processor MAY process a queue with Processor, WorkerHost, OnWorkerEvent and the Job type', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";\nimport type { Job } from "bullmq";',
      }).toPassArchitectureLint();
    });

    it.each([
      'apps/__processors-fixture__/src/processors/ledger-record/application/__fixture__.ts',
      'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/__fixture__.ts',
      'apps/__processors-fixture__/src/features/product/presentation/__fixture__.ts',
      'apps/__processors-fixture__/src/features/product/infrastructure/__fixture__.ts',
      'apps/__processors-fixture__/src/app/__fixture__.ts',
    ])('%s may NOT process a queue — only processors do', async (file) => {
      await expect({
        file,
        code: 'import { Processor } from "@nestjs/bullmq";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor infrastructure/queue MAY take InjectQueue and the Queue type, to manage the jobs of its queue', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/queue/__fixture__.ts',
        code: 'import { InjectQueue } from "@nestjs/bullmq";\nimport type { Queue } from "bullmq";',
      }).toPassArchitectureLint();
    });

    it('the module of a queue adapter MAY register its queue with the queue lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/infrastructure/queue/__fixture__.ts',
        code: 'import { BullSetupModule } from "@acme-libs/queue";\nimport { X_QUEUE } from "../../outbound";',
      }).toPassArchitectureLint();
    });

    it('common/shared may NOT register a queue — the module of its queue adapter does', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/common/shared/ledger-record/queues/__fixture__.ts',
        code: 'import { BullSetupModule } from "@acme-libs/queue";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      'import { BullModule } from "@nestjs/bullmq";',
      'import { InjectQueue } from "@nestjs/bullmq";',
    ])(
      'common/shared may NOT take Bull itself (%s) — it registers queues with the queue lib',
      async (code) => {
        await expect({
          file: 'apps/__processors-fixture__/src/common/shared/ledger-record/queues/__fixture__.ts',
          code,
        }).toBreakRule('boundaries/dependencies');
      },
    );

    it('the app module may NOT connect Bull to Redis itself, the app lib mounts the queue lib', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/app/app.module.ts',
        code: 'import { BullSetupModule } from "@acme-libs/queue";',
      }).toBreakRule('boundaries/dependencies');
    });

    it.each([
      'apps/__processors-fixture__/src/app/app.module.ts',
      'apps/__processors-fixture__/src/app/setup/queue/__fixture__.ts',
    ])('%s may NOT take Bull itself — the queue lib connects it to Redis', async (file) => {
      await expect({
        file,
        code: 'import { BullModule } from "@nestjs/bullmq";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT import the HTTP platform', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.ts',
        code: 'import { x } from "@nestjs/platform-express";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('nested processors (<module>/modules/<submodule>)', () => {
    it('the aggregator root MAY mount its submodules through modules/index.ts', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/digest/__fixture__.ts',
        code: 'import { x } from "./modules";',
      }).toPassArchitectureLint();
    });

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
        file: 'apps/__processors-fixture__/src/processors/ledger-record/application/__fixture__.ts',
        code: 'import { x } from "../../purge/application";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a processor may NOT reach a feature', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/processors/ledger-record/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../features/product";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('a feature may NOT reach a processor', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/features/product/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../processors/ledger-record";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('common may NOT reach processors', async () => {
      await expect({
        file: 'apps/__processors-fixture__/src/common/shared/auth/__fixture__.ts',
        code: 'import { x } from "../../../processors";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('another app may NOT mount these processors', async () => {
      await expect({
        file: 'apps/__processors-other-fixture__/src/app/__fixture__.ts',
        code: 'import { x } from "../../../__processors-fixture__/src/processors";',
      }).toBreakRule('boundaries/dependencies');
    });
  });
});
