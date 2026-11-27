import { lintConfigFor } from '../support/lint';

interface IResolvedConfig {
  rules: Record<string, [number | string, ...unknown[]]>;
  settings: Record<string, unknown>;
}

describe('the config itself (eslint.config.mjs, as ESLint resolves it)', () => {
  let config: IResolvedConfig;
  let categories: string[];

  beforeAll(async () => {
    config = (await lintConfigFor(
      'apps/staff-app/src/features/catalog/modules/product/application/__fixture__.ts',
    )) as IResolvedConfig;
    categories = (config.settings['boundaries/files'] as { category: string }[]).map(
      (file) => file.category,
    );
  });

  it.each([
    'boundaries/dependencies',
    'boundaries/no-unknown-dependencies',
    'boundaries/no-unknown-files',
    'no-restricted-imports',
    'no-restricted-syntax',
  ])('enforces %s at ERROR', (rule) => {
    const [severity] = config.rules[rule];

    expect(severity).toBe(2);
  });

  it('denies dependencies by default and checks packages and unknown local files too', () => {
    const [, options] = config.rules['boundaries/dependencies'] as [
      number,
      Record<string, unknown>,
    ];

    expect(options.default).toBe('disallow');
    expect(options.checkAllOrigins).toBe(true);
    expect(options.checkUnknownLocals).toBe(true);
  });

  it('checks re-exports and dynamic imports, not only imports', () => {
    expect(config.settings['boundaries/dependency-nodes']).toEqual([
      'import',
      'export',
      'dynamic-import',
    ]);
  });

  it('gives every file exactly one category — the first matching pattern wins', () => {
    expect(config.settings['boundaries/files-single-match']).toBe(true);
  });

  it.each([
    ['apps:features:unit:infrastructure:core-adapters', 'apps:features:unit:infrastructure'],
    ['apps:features:unit:infrastructure:common-adapters', 'apps:features:unit:infrastructure'],
    ['apps:features:unit:infrastructure:lib-adapters', 'apps:features:unit:infrastructure'],
    ['apps:features:unit:infrastructure:config', 'apps:features:unit:infrastructure'],
    ['apps:processors:unit:infrastructure:config', 'apps:processors:unit:infrastructure'],
    ['core:modules:unit:infrastructure:config', 'core:modules:unit:infrastructure'],
    ['apps:processors:unit:infrastructure:core-adapters', 'apps:processors:unit:infrastructure'],
    ['apps:processors:unit:infrastructure:common-adapters', 'apps:processors:unit:infrastructure'],
    [
      'apps:common:modules:unit:infrastructure:core-adapters',
      'apps:common:modules:unit:infrastructure',
    ],
    [
      'apps:common:modules:unit:infrastructure:common-adapters',
      'apps:common:modules:unit:infrastructure',
    ],
    ['apps:global:unit:infrastructure:common-adapters', 'apps:global:unit:infrastructure'],
    ['apps:global:unit:infrastructure:lib-adapters', 'apps:global:unit:infrastructure'],
    ['apps:common:modules:unit:shell:facade', 'apps:common:modules:unit:shell'],
    ['core:modules:unit:shell:facade', 'core:modules:unit:shell'],
    ['libs:contracts', 'libs'],
  ])('keeps %s AHEAD of %s — first match wins', (specific, general) => {
    expect(categories.indexOf(specific)).toBeGreaterThanOrEqual(0);
    expect(categories.indexOf(specific)).toBeLessThan(categories.indexOf(general));
  });

  it('gives core modules the app layers, with facades in shell/ instead of presentation/', () => {
    expect(categories).toEqual(
      expect.arrayContaining([
        'apps:features:unit:domain',
        'core:modules:unit:domain',
        'apps:features:unit:outbound',
        'core:modules:unit:outbound',
        'apps:features:unit:application',
        'core:modules:unit:application',
        'apps:features:unit:infrastructure',
        'core:modules:unit:infrastructure',
        'apps:features:unit:presentation',
        'core:modules:unit:shell:facade',
      ]),
    );
    expect(categories).not.toContain('core:modules:unit:presentation');
  });
});
