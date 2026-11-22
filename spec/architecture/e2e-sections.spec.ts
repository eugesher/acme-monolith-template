import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('e2e sections', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/entities/src/index.ts',
      'apps/__e2e-fixture__/test/features/index.ts',
      'apps/__e2e-fixture__/test/context/app-e2e.context.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('an e2e section follows the spec rules and MAY pass an awaited call to another call', async () => {
    await expect({
      file: 'apps/staff-app/test/features/__fixture__.e2e.ts',
      code: 'declare const find: () => Promise<number>;declare const save: (value: number) => void;export const run = async () => save(await find());',
    }).toPassArchitectureLint();
  });

  it.each([
    '@nestjs/bullmq',
    '@nestjs/common',
    '@nestjs/config',
    'ioredis',
    'supertest',
    'typeorm',
  ])('the e2e code MAY import %s', async (source) => {
    await expect({
      file: 'apps/customer-app/test/context/__fixture__.ts',
      code: `import { x } from "${source}";`,
    }).toPassArchitectureLint();
  });

  it.each(['argon2', '@nestjs/core', '@nestjs/typeorm', '@nestjs/testing', 'nestjs-pino'])(
    'the e2e code may NOT import %s',
    async (source) => {
      await expect({
        file: 'apps/customer-app/test/context/__fixture__.ts',
        code: `import * as x from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('an e2e section MAY open a correlation context with the observability lib', async () => {
    await expect({
      file: 'apps/staff-app/test/features/__fixture__.e2e.ts',
      code: 'import { CorrelationContextHelper } from "@acme-libs/observability";',
    }).toPassArchitectureLint();
  });

  it('the e2e context MAY use the testing lib', async () => {
    await expect({
      file: 'apps/customer-app/test/context/__fixture__.ts',
      code: 'import { E2EContext } from "@acme-libs/testing";\nimport { CACHE_REDIS_CLIENT_TOKEN } from "@acme-libs/testing";',
    }).toPassArchitectureLint();
  });

  it('the e2e context MAY read a queue contract of core', async () => {
    await expect({
      file: 'apps/processor-app/test/context/__fixture__.ts',
      code: 'import { x } from "@acme-core/contracts/__ledger-fixture__";',
    }).toPassArchitectureLint();
  });

  it('an e2e spec MAY read the entities of core', async () => {
    await expect({
      file: 'apps/staff-app/test/app/__fixture__.e2e-spec.ts',
      code: 'import * as entities from "@acme-core/entities";',
    }).toPassArchitectureLint();
  });

  it('an e2e spec MAY mount the e2e sections and the context of its app', async () => {
    await expect({
      file: 'apps/__e2e-fixture__/test/app/__fixture__.e2e-spec.ts',
      code: 'import { AuthE2E } from "../features";import { AppE2EContext } from "../context/app-e2e.context";',
    }).toPassArchitectureLint();
  });

  it('an e2e spec MAY mount a section the apps share from the testing lib', async () => {
    await expect({
      file: 'apps/processor-app/test/app/__fixture__.e2e-spec.ts',
      code: 'import { HealthE2E } from "@acme-libs/testing";',
    }).toPassArchitectureLint();
  });

  it('an e2e spec may NOT mount the e2e sections of another app', async () => {
    await expect({
      file: 'apps/__other-e2e-fixture__/test/app/__fixture__.e2e-spec.ts',
      code: 'import { AuthE2E } from "../../../__e2e-fixture__/test/features";',
    }).toBreakRule('boundaries/dependencies');
  });
});
