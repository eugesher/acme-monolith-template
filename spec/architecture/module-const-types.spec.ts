import '../support/lint';

describe('module-level const types', () => {
  it.each([
    'declare const make: () => number;export const value = make();',
    'declare const make: () => number;const value = make();export { value };',
    'declare const factory: { make: () => number };export const value = factory.make();',
    'declare const load: () => Promise<number>;export const value = await load();',
  ])('a module-level const may NOT hold a call result without a type: %s', async (code) => {
    await expect({
      file: 'libs/toolkit/src/__fixture__.ts',
      code,
    }).toBreakRule('no-restricted-syntax');
  });

  it.each([
    'declare const make: () => number;export const value: number = make();',
    'export const VALUE_TOKEN = Symbol("VALUE_TOKEN");',
    'declare const createParamDecorator: (factory: () => string) => () => ParameterDecorator;export const Value = createParamDecorator(() => "value");',
    'export const NAME = "name";',
    'export const NAMES = ["a", "b"];',
    'export const NAMES = new Set(["a", "b"]);',
    'export const double = (value: number): number => value * 2;',
    'declare const make: () => number;export const double = (): number => { const value = make(); return value * 2; };',
    'declare const make: () => number[];export const [first] = make();',
    'declare const make: () => number;export const value = make() as number;',
  ])('a module-level const MAY go without a type: %s', async (code) => {
    await expect({
      file: 'libs/toolkit/src/__fixture__.ts',
      code,
    }).not.toBreakRule('no-restricted-syntax');
  });

  it.each([
    'apps/staff-app/src/features/product/application/cases/spec/__fixture__.spec.ts',
    'scripts/node/__fixture__.ts',
    'test/infra/seed/__fixture__.ts',
  ])('%s keeps the rule', async (file) => {
    await expect({
      file,
      code: 'declare const make: () => number;export const value = make();',
    }).toBreakRule('no-restricted-syntax');
  });
});
