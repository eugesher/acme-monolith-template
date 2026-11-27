import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('app contracts (contracts/<x>)', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__contracts-fixture__/src/contracts/auth/index.ts',
      'libs/http/src/index.ts',
      'libs/kernel/src/index.ts',
      'libs/toolkit/src/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('bootstrap may NOT reach app contracts', async () => {
    await expect({
      file: 'apps/__contracts-fixture__/src/app/shell/app.module.ts',
      code: 'import { x } from "../../contracts/auth";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('contracts MAY reach contracts and the kernel and toolkit libs', async () => {
    await expect({
      file: 'apps/__contracts-fixture__/src/contracts/auth/ports/__fixture__.ts',
      code: 'import { x } from "..";\nimport { y } from "../../../../../../libs/kernel/src";\nimport { z } from "../../../../../../libs/toolkit/src";',
    }).toPassArchitectureLint();
  });

  it('contracts may NOT reach other libs', async () => {
    await expect({
      file: 'apps/__contracts-fixture__/src/contracts/auth/ports/__fixture__.ts',
      code: 'import { x } from "../../../../../../libs/http/src";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('contracts may NOT import external packages', async () => {
    await expect({
      file: 'apps/__contracts-fixture__/src/contracts/auth/ports/__fixture__.ts',
      code: 'import { x } from "@nestjs/common";',
    }).toBreakRule('boundaries/dependencies');
  });
});
