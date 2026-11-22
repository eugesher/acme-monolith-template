import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('libs', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'libs/app/src/index.ts',
      'libs/auth/src/index.ts',
      'libs/bootstrap/src/index.ts',
      'libs/cache/src/index.ts',
      'libs/config/src/index.ts',
      'libs/credentials/src/index.ts',
      'libs/database/src/index.ts',
      'libs/domain/src/index.ts',
      'libs/health/src/index.ts',
      'libs/http/src/index.ts',
      'libs/http/src/exceptions/unauthorized-http.exception.ts',
      'libs/kernel/src/index.ts',
      'libs/local-storage/src/index.ts',
      'libs/observability/src/index.ts',
      'libs/openapi/src/index.ts',
      'libs/queue/src/index.ts',
      'libs/toolkit/src/index.ts',
      'libs/contracts/src/auth/index.ts',
      'libs/contracts/src/cache/index.ts',
      'libs/contracts/src/credentials/index.ts',
      'libs/contracts/src/database/index.ts',
      'libs/contracts/src/health/index.ts',
      'libs/contracts/src/local-storage/index.ts',
      'core/modules/src/__ledger-fixture__/index.ts',
      'apps/__libs-fixture__/src/features/product/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('a lib may NOT reach core', async () => {
    await expect({
      file: 'libs/observability/src/__fixture__.ts',
      code: 'import { x } from "../../../core/modules/src/__ledger-fixture__";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a lib may NOT reach apps', async () => {
    await expect({
      file: 'libs/observability/src/__fixture__.ts',
      code: 'import { x } from "../../../apps/__libs-fixture__/src/features/product";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a lib MAY import its own files', async () => {
    await expect({
      file: 'libs/http/src/__fixture__.ts',
      code: 'import { x } from "./exceptions/unauthorized-http.exception";',
    }).toPassArchitectureLint();
  });

  it.each([
    ['kernel', []],
    ['toolkit', []],
    ['domain', []],
    [
      'app',
      [
        'kernel',
        'toolkit',
        'domain',
        'cache',
        'database',
        'http',
        'local-storage',
        'observability',
        'queue',
      ],
    ],
    ['auth', ['kernel', 'toolkit', 'domain']],
    ['bootstrap', ['kernel', 'toolkit', 'domain', 'observability', 'openapi']],
    ['cache', ['kernel', 'toolkit', 'domain', 'config', 'observability']],
    ['config', ['kernel', 'toolkit', 'domain']],
    ['credentials', ['kernel', 'toolkit', 'domain']],
    ['database', ['kernel', 'toolkit', 'domain', 'config', 'local-storage']],
    ['health', ['kernel', 'toolkit', 'domain']],
    ['http', ['kernel', 'toolkit', 'domain', 'config', 'observability']],
    ['local-storage', ['kernel', 'toolkit', 'domain', 'observability']],
    ['observability', ['kernel', 'toolkit', 'domain', 'config']],
    ['openapi', ['kernel', 'toolkit', 'domain', 'http']],
    ['queue', ['kernel', 'toolkit', 'domain', 'config']],
    ['testing', ['kernel', 'toolkit', 'domain', 'bootstrap']],
  ])('%s may import only %j of the other libs', async (from, allowed) => {
    const libs = [
      'app',
      'auth',
      'bootstrap',
      'cache',
      'config',
      'credentials',
      'database',
      'domain',
      'health',
      'http',
      'kernel',
      'local-storage',
      'observability',
      'openapi',
      'queue',
      'toolkit',
    ];

    const others = libs.filter((lib) => lib !== from);
    const reachable = others.filter((lib) => allowed.includes(lib));
    const unreachable = others.filter((lib) => !allowed.includes(lib));

    for (const to of reachable) {
      await expect({
        file: `libs/${from}/src/__fixture__.ts`,
        code: `import { x } from "../../${to}/src";`,
      }).toPassArchitectureLint();
    }

    for (const to of unreachable) {
      await expect({
        file: `libs/${from}/src/__fixture__.ts`,
        code: `import { x } from "../../${to}/src";`,
      }).toBreakRule('boundaries/dependencies');
    }
  });

  it('the testing lib MAY reach the outbound of the cache lib for its redis token', async () => {
    await expect({
      file: 'libs/testing/src/cache/__fixture__.ts',
      code: 'import { x } from "../../../cache/src/outbound";',
    }).toPassArchitectureLint();
  });

  it('the testing lib MAY import the Nest packages an e2e context compiles an app with and reads its routes from', async () => {
    await expect({
      file: 'libs/testing/src/e2e/__fixture__.ts',
      code: 'import { RequestMethod } from "@nestjs/common";\nimport { ModulesContainer, Reflector } from "@nestjs/core";\nimport { Test } from "@nestjs/testing";',
    }).toPassArchitectureLint();
  });

  it('the testing lib MAY import supertest for the e2e sections the apps share', async () => {
    await expect({
      file: 'libs/testing/src/e2e/__fixture__.e2e.ts',
      code: 'import request from "supertest";',
    }).toPassArchitectureLint();
  });

  it('a lib may NOT import the testing lib outside its specs', async () => {
    await expect({
      file: 'libs/cache/src/application/__fixture__.ts',
      code: 'import { x } from "../../../testing/src";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a feature may NOT import the testing lib outside its specs', async () => {
    await expect({
      file: 'apps/__libs-fixture__/src/features/product/application/__fixture__.ts',
      code: 'import { x } from "@acme-libs/testing";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a spec of any layer MAY import the testing lib', async () => {
    await expect({
      file: 'libs/cache/src/application/spec/__fixture__.spec.ts',
      code: 'import { x } from "../../../../testing/src";',
    }).toPassArchitectureLint();
  });

  it.each([
    ['auth', ['auth']],
    ['bootstrap', []],
    ['cache', ['cache']],
    ['config', []],
    ['credentials', ['credentials']],
    ['database', ['database']],
    ['domain', []],
    ['health', ['cache', 'health']],
    ['http', []],
    ['kernel', []],
    ['local-storage', ['local-storage']],
    ['observability', []],
    ['openapi', []],
    ['queue', []],
    ['testing', []],
    ['toolkit', []],
  ])('%s may import only the contracts of %j', async (from, allowed) => {
    const contracts = ['auth', 'cache', 'credentials', 'database', 'health', 'local-storage'];

    const reachable = contracts.filter((contract) => allowed.includes(contract));
    const unreachable = contracts.filter((contract) => !allowed.includes(contract));

    for (const to of reachable) {
      await expect({
        file: `libs/${from}/src/infrastructure/__fixture__.ts`,
        code: `import { x } from "../../../contracts/src/${to}";`,
      }).toPassArchitectureLint();
    }

    for (const to of unreachable) {
      await expect({
        file: `libs/${from}/src/infrastructure/__fixture__.ts`,
        code: `import { x } from "../../../contracts/src/${to}";`,
      }).toBreakRule('boundaries/dependencies');
    }
  });

  it('the contracts of database MAY import typeorm — the repository host port returns its Repository', async () => {
    await expect({
      file: 'libs/contracts/src/database/__fixture__.ts',
      code: 'import type { Repository } from "typeorm";',
    }).toPassArchitectureLint();
  });

  it.each(['auth', 'cache', 'credentials', 'health'])(
    'the contracts of %s may NOT import typeorm',
    async (lib) => {
      await expect({
        file: `libs/contracts/src/${lib}/__fixture__.ts`,
        code: 'import type { Repository } from "typeorm";',
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each(['auth', 'cache', 'credentials', 'database', 'health', 'local-storage'])(
    'the contracts of %s MAY import the framework-free libs',
    async (lib) => {
      await expect({
        file: `libs/contracts/src/${lib}/__fixture__.ts`,
        code: 'import { x } from "../../../kernel/src";\nimport { y } from "../../../toolkit/src";\nimport { z } from "../../../domain/src";',
      }).toPassArchitectureLint();
    },
  );

  it.each([
    ['libs/contracts/src/cache/__fixture__.ts', '../../../cache/src'],
    ['libs/contracts/src/cache/__fixture__.ts', '../../../observability/src'],
    ['libs/contracts/src/cache/__fixture__.ts', '../database'],
  ])(
    '%s may NOT import %s, contracts depend on nothing but the framework-free libs',
    async (file, source) => {
      await expect({ file, code: `import { x } from "${source}";` }).toBreakRule(
        'boundaries/dependencies',
      );
    },
  );

  it.each([
    ['toolkit', '@nestjs/common'],
    ['toolkit', 'rxjs'],
    ['kernel', '@nestjs/common'],
    ['kernel', 'reflect-metadata'],
    ['kernel', 'crypto'],
    ['domain', '@nestjs/common'],
    ['domain', 'typeorm'],
    ['domain', 'crypto'],
  ])('the framework-free lib %s may NOT import %s', async (lib, source) => {
    await expect({
      file: `libs/${lib}/src/__fixture__.ts`,
      code: `import { x } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it('the app lib MAY import the Nest packages the setup of an app takes its options from', async () => {
    await expect({
      file: 'libs/app/src/setup/__fixture__.ts',
      code: 'import type { DynamicModule } from "@nestjs/common";\nimport type { TypeOrmModuleOptions } from "@nestjs/typeorm";',
    }).toPassArchitectureLint();
  });

  it.each(['@nestjs/core', '@nestjs/config', 'typeorm'])(
    'the app lib may NOT import %s',
    async (source) => {
      await expect({
        file: 'libs/app/src/setup/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the toolkit lib MAY import crypto (BodyFingerprintHelper)', async () => {
    await expect({
      file: 'libs/toolkit/src/__fixture__.ts',
      code: 'import { createHash } from "crypto";',
    }).toPassArchitectureLint();
  });

  it('the database helpers of the toolkit MAY import typeorm (MysqlErrorHelper)', async () => {
    await expect({
      file: 'libs/toolkit/src/database/__fixture__.ts',
      code: 'import { QueryFailedError } from "typeorm";',
    }).toPassArchitectureLint();
  });

  it('the rest of the toolkit may NOT import typeorm', async () => {
    await expect({
      file: 'libs/toolkit/src/__fixture__.ts',
      code: 'import { QueryFailedError } from "typeorm";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the kernel lib may NOT import typeorm', async () => {
    await expect({
      file: 'libs/kernel/src/__fixture__.ts',
      code: 'import { QueryFailedError } from "typeorm";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the bootstrap lib MAY import the Nest packages that set up an app', async () => {
    await expect({
      file: 'libs/bootstrap/src/app/__fixture__.ts',
      code: 'import { INestApplication } from "@nestjs/common";\nimport { ConfigService } from "@nestjs/config";\nimport { Logger } from "nestjs-pino";',
    }).toPassArchitectureLint();
  });

  it('the bootstrap lib may NOT import NestFactory: main.ts creates the app', async () => {
    await expect({
      file: 'libs/bootstrap/src/app/__fixture__.ts',
      code: 'import { NestFactory } from "@nestjs/core";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the config lib MAY import the Nest config packages it wraps', async () => {
    await expect({
      file: 'libs/config/src/provider/__fixture__.ts',
      code: 'import { Provider } from "@nestjs/common";\nimport { ConfigService } from "@nestjs/config";',
    }).toPassArchitectureLint();
  });

  it('the config lib MAY import fs and path to find the env files of an app', async () => {
    await expect({
      file: 'libs/config/src/env/__fixture__.ts',
      code: 'import { existsSync } from "fs";\nimport { dirname, join } from "path";',
    }).toPassArchitectureLint();
  });

  it('the config lib may NOT import dotenv — @nestjs/config loads the env files', async () => {
    await expect({
      file: 'libs/config/src/env/__fixture__.ts',
      code: 'import dotenv from "dotenv";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the config lib MAY import joi for the schema fragments the apps assemble', async () => {
    await expect({
      file: 'libs/config/src/schema/__fixture__.ts',
      code: 'import Joi from "joi";',
    }).toPassArchitectureLint();
  });

  it('the http lib MAY import @nestjs/swagger for the page query of a list', async () => {
    await expect({
      file: 'libs/http/src/pagination/__fixture__.ts',
      code: 'import { ApiPropertyOptional } from "@nestjs/swagger";',
    }).toPassArchitectureLint();
  });

  it('the observability lib MAY import the logging, tracing and async context packages', async () => {
    await expect({
      file: 'libs/observability/src/correlation/__fixture__.ts',
      code: 'import { trace } from "@opentelemetry/api";\nimport { NodeSDK } from "@opentelemetry/sdk-node";\nimport { ClsServiceManager } from "nestjs-cls";\nimport { PinoLogger } from "nestjs-pino";',
    }).toPassArchitectureLint();
  });

  it.each(['@nestjs-cls/transactional', '@nestjs-cls/transactional-adapter-typeorm'])(
    'the observability lib may NOT import %s — the local-storage lib owns transactions',
    async (source) => {
      await expect({
        file: 'libs/observability/src/correlation/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the local-storage lib MAY import the transaction, async context and logging packages', async () => {
    await expect({
      file: 'libs/local-storage/src/cls/__fixture__.ts',
      code: 'import { TransactionHost } from "@nestjs-cls/transactional";\nimport { ClsService } from "nestjs-cls";\nimport { PinoLogger } from "nestjs-pino";',
    }).toPassArchitectureLint();
  });

  it.each(['nestjs-cls', 'nestjs-pino'])(
    'the database lib may NOT import %s — the local-storage lib owns the async context',
    async (source) => {
      await expect({
        file: 'libs/database/src/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the health lib MAY import the packages its probes and use cases need', async () => {
    await expect({
      file: 'libs/health/src/infrastructure/probes/__fixture__.ts',
      code: 'import { Injectable } from "@nestjs/common";\nimport { PinoLogger } from "nestjs-pino";\nimport { DataSource } from "typeorm";',
    }).toPassArchitectureLint();
  });

  it.each(['ioredis', '@nestjs/typeorm', '@nestjs/config'])(
    'the health lib may NOT import %s',
    async (source) => {
      await expect({
        file: 'libs/health/src/infrastructure/probes/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the auth lib MAY import the Nest packages its guards and token check need', async () => {
    await expect({
      file: 'libs/auth/src/guards/__fixture__.ts',
      code: 'import { Injectable } from "@nestjs/common";\nimport { ConfigService } from "@nestjs/config";\nimport { Reflector } from "@nestjs/core";\nimport { JwtService } from "@nestjs/jwt";',
    }).toPassArchitectureLint();
  });

  it('the auth lib MAY import @nestjs/swagger, so a public route needs no token in the OpenAPI document either', async () => {
    await expect({
      file: 'libs/auth/src/decorators/__fixture__.ts',
      code: 'import { applyDecorators } from "@nestjs/common";\nimport { ApiSecurity } from "@nestjs/swagger";',
    }).toPassArchitectureLint();
  });

  it.each(['typeorm', 'nestjs-pino', 'argon2'])(
    'the auth lib may NOT import %s',
    async (source) => {
      await expect({
        file: 'libs/auth/src/guards/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the queue lib MAY import the packages Bull setup needs', async () => {
    await expect({
      file: 'libs/queue/src/bull/__fixture__.ts',
      code: 'import { BullModule } from "@nestjs/bullmq";\nimport { DynamicModule } from "@nestjs/common";\nimport { ConfigService } from "@nestjs/config";',
    }).toPassArchitectureLint();
  });

  it.each(['bullmq', 'ioredis', 'nestjs-pino'])(
    'the queue lib may NOT import %s',
    async (source) => {
      await expect({
        file: 'libs/queue/src/bull/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the credentials lib MAY import the packages hashing and signing need', async () => {
    await expect({
      file: 'libs/credentials/src/infrastructure/password-hasher/__fixture__.ts',
      code: 'import { Injectable } from "@nestjs/common";\nimport { ConfigService } from "@nestjs/config";\nimport { JwtService } from "@nestjs/jwt";\nimport { hash } from "argon2";',
    }).toPassArchitectureLint();
  });

  it.each(['typeorm', 'nestjs-pino'])('the credentials lib may NOT import %s', async (source) => {
    await expect({
      file: 'libs/credentials/src/infrastructure/password-hasher/__fixture__.ts',
      code: `import { x } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each(['http', 'health', 'observability'])(
    'the %s lib may NOT import @nestjs/jwt — auth verifies tokens and credentials signs them',
    async (lib) => {
      await expect({
        file: `libs/${lib}/src/__fixture__.ts`,
        code: 'import { JwtService } from "@nestjs/jwt";',
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each(['nestjs-pino', '@opentelemetry/api', 'async_hooks'])(
    'the kernel lib may NOT import %s',
    async (source) => {
      await expect({
        file: 'libs/kernel/src/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );
});
