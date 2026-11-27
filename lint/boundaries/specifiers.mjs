const own = (...keys) =>
  Object.fromEntries(keys.map((key) => [key, `{{ from.file.captured.${key} }}`]));

const to = (categories, captured) => ({
  to: { file: captured ? { categories, captured } : { categories } },
});

const libLayers = ['shell', 'application', 'infrastructure', 'outbound'];

const libFolders = ['naming', 'repository'];

const libNames = [
  'app',
  'auth',
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
  'testing',
  'toolkit',
];

const units = [
  ['@acme-<app>/features/<module>/', 'acme-app:features', ['app', 'module']],
  ['@acme-<app>/processors/<module>/', 'acme-app:processors', ['app', 'module']],
  ['@acme-<app>/common/modules/<module>/', 'acme-app:common:modules', ['app', 'module']],
  ['@acme-<app>/global/<module>/', 'acme-app:global', ['app', 'module']],
  ['@acme-core/modules/<module>/', 'acme-core:modules', ['module']],
];

const unitPaths = {
  'shell/*.module': 'shell:module',
  'shell/*.facade': 'shell:facade',
  modules: 'modules:index',
};

const fixed = {
  '@acme-*/app': to('acme-app:app:index'),
  '@acme-<app>/app': to('acme-app:app:index', own('app')),
  '@acme-<app>/app/setup/config': to('acme-app:app:setup:config', own('app')),
  '@acme-<app>/app/shell/app.module': to('acme-app:app:shell:module', own('app')),
  '@acme-<app>/app/setup/app-setup.module': to('acme-app:app:setup:module', own('app')),
  '@acme-<app>/app/setup/entities': to('acme-app:app:setup:entities', own('app')),
  '@acme-<app>/global': to('acme-app:global:index', own('app')),
  '@acme-<app>/global/*': to('acme-app:global:module:index', own('app')),
  '@acme-<app>/features': to('acme-app:features:index', own('app')),
  '@acme-<app>/features/*': to('acme-app:features:module', { ...own('app'), module: '*' }),
  '@acme-<app>/features/<module>/modules/*': to('acme-app:features:module', {
    ...own('app'),
    module: '{{ from.file.captured.module }}/modules/*',
  }),
  '@acme-<app>/processors': to('acme-app:processors:index', own('app')),
  '@acme-<app>/processors/*': to('acme-app:processors:module', { ...own('app'), module: '*' }),
  '@acme-<app>/processors/<module>/modules/*': to('acme-app:processors:module', {
    ...own('app'),
    module: '{{ from.file.captured.module }}/modules/*',
  }),
  '@acme-<app>/common/entities': to('acme-app:common:entities', own('app')),
  '@acme-<app>/common/modules': to('acme-app:common:modules:index', own('app')),
  '@acme-<app>/common/modules/*': to('acme-app:common:modules:module:index', own('app')),
  '@acme-<app>/common/shared': to('acme-app:common:shared:index', own('app')),
  '@acme-<app>/common/shared/*': to('acme-app:common:shared:module:index', own('app')),
  '@acme-<app>/common/shared/*/**': to('acme-app:common:shared', own('app')),
  '@acme-<app>/contracts': to('acme-app:contracts', own('app')),
  '@acme-<app>/contracts/<module>': to('acme-app:contracts', own('app', 'module')),
  'apps/<app>/test/**': to('acme-app:test', own('app')),
  '@acme-core/contracts': to('acme-core:contracts'),
  '@acme-core/contracts/<module>': to('acme-core:contracts', own('module')),
  '@acme-core/domain': to('acme-core:domain'),
  '@acme-core/entities': to('acme-core:entities'),
  '@acme-core/modules/*': to('acme-core:modules:module:index'),
  '@acme-core/queues': to('acme-core:queues'),
  '@acme-libs/<lib>': to('acme-libs', own('lib')),
  '@acme-libs/contracts/<lib>': to('acme-libs:contracts', own('lib')),
  '@acme-libs/cache/outbound': to('acme-libs', { lib: 'cache', file: 'outbound/**' }),
  'spec/**': to('repo:spec'),
  'scripts/**': to('repo:scripts'),
  'migrations/**': to('repo:migrations'),
  'test/system/**': to('repo:test:system'),
  'test/**': to('repo:test'),
  ...Object.fromEntries(
    libNames.flatMap((name) => [
      [`@acme-libs/${name}`, to('acme-libs', { lib: [name] })],
      [`@acme-libs/contracts/${name}`, to('acme-libs:contracts', { lib: [name] })],
    ]),
  ),
  ...Object.fromEntries(
    libLayers.map((layer) => [
      `@acme-libs/<lib>/${layer}`,
      to('acme-libs', { ...own('lib'), file: `{${layer},*/${layer}}/**` }),
    ]),
  ),
  ...Object.fromEntries(
    libFolders.map((folder) => [
      `@acme-libs/<lib>/${folder}`,
      to('acme-libs', { ...own('lib'), file: `${folder}/**` }),
    ]),
  ),
};

const unitSelector = (specifier, categories) => {
  const unit = units.find(([prefix]) => specifier.startsWith(prefix));

  if (!unit) {
    return null;
  }

  const [prefix, category, keys] = unit;
  const path = specifier.slice(prefix.length);

  if (path.endsWith('/**')) {
    const base = `${category}:${path.slice(0, -'/**'.length).replaceAll('/', ':')}`;
    const targets = [...categories].filter((name) => name === base || name.startsWith(`${base}:`));

    return targets.length > 0 ? targets.map((target) => to(target, own(...keys))) : null;
  }

  const target = `${category}:${unitPaths[path] ?? path.replaceAll('/', ':')}`;

  return categories.has(target) ? [to(target, own(...keys))] : null;
};

const isLocal = (specifier) =>
  specifier.startsWith('@acme-') || specifier.includes('/**') || specifier.startsWith('apps/');

export const selectorsOf = (specifier, categories) => {
  const selectors = fixed[specifier] ? [fixed[specifier]] : unitSelector(specifier, categories);

  if (selectors) {
    return selectors;
  }

  if (isLocal(specifier)) {
    throw new Error(`lint/boundaries: unknown import ${specifier}`);
  }

  return [{ to: { module: { origin: ['external', 'core'], source: [specifier] } } }];
};
