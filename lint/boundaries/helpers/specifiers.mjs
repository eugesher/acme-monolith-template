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
  ['@acme-<app>/features/<unit>/', 'apps:features:unit', ['app', 'unit']],
  ['@acme-<app>/processors/<unit>/', 'apps:processors:unit', ['app', 'unit']],
  ['@acme-<app>/common/modules/<unit>/', 'apps:common:modules:unit', ['app', 'unit']],
  ['@acme-<app>/global/<unit>/', 'apps:global:unit', ['app', 'unit']],
  ['@acme-core/modules/<unit>/', 'core:modules:unit', ['unit']],
];

const unitPaths = {
  'shell/*.module': 'shell:module',
  'shell/*.facade': 'shell:facade',
  modules: 'modules:index',
};

const fixed = {
  '@acme-*/app': to('apps:app:index'),
  '@acme-<app>/app': to('apps:app:index', own('app')),
  '@acme-<app>/app/setup/config': to('apps:app:setup:config', own('app')),
  '@acme-<app>/app/shell': to('apps:app:shell', own('app')),
  '@acme-<app>/app/setup/app-setup.module': to('apps:app:setup:module', own('app')),
  '@acme-<app>/app/setup/entities': to('apps:app:setup:entities', own('app')),
  '@acme-<app>/global': to('apps:global:index', own('app')),
  '@acme-<app>/global/*': to('apps:global:unit:index', own('app')),
  '@acme-<app>/features': to('apps:features:index', own('app')),
  '@acme-<app>/features/*': to('apps:features:unit', { ...own('app'), unit: '*' }),
  '@acme-<app>/features/<unit>/modules/*': to('apps:features:unit', {
    ...own('app'),
    unit: '{{ from.file.captured.unit }}/modules/*',
  }),
  '@acme-<app>/processors': to('apps:processors:index', own('app')),
  '@acme-<app>/processors/*': to('apps:processors:unit', { ...own('app'), unit: '*' }),
  '@acme-<app>/processors/<unit>/modules/*': to('apps:processors:unit', {
    ...own('app'),
    unit: '{{ from.file.captured.unit }}/modules/*',
  }),
  '@acme-<app>/common/entities': to('apps:common:entities', own('app')),
  '@acme-<app>/common/modules': to('apps:common:modules:index', own('app')),
  '@acme-<app>/common/modules/*': to('apps:common:modules:unit:index', own('app')),
  '@acme-<app>/common/shared': to('apps:common:shared:index', own('app')),
  '@acme-<app>/common/shared/*': to('apps:common:shared:unit:index', own('app')),
  '@acme-<app>/common/shared/*/**': to('apps:common:shared:unit', own('app')),
  '@acme-<app>/contracts': to('apps:contracts', own('app')),
  '@acme-<app>/contracts/<unit>': to('apps:contracts', own('app', 'unit')),
  'apps/<app>/test/**': to('apps:test', own('app')),
  '@acme-core/contracts': to('core:contracts'),
  '@acme-core/contracts/<unit>': to('core:contracts', own('unit')),
  '@acme-core/domain': to('core:domain'),
  '@acme-core/entities': to('core:entities'),
  '@acme-core/modules/*': to('core:modules:unit:index'),
  '@acme-core/queues': to('core:queues'),
  '@acme-libs/<lib>': to('libs', own('lib')),
  '@acme-libs/contracts/<lib>': to('libs:contracts', own('lib')),
  '@acme-libs/cache/outbound': to('libs', { lib: 'cache', file: 'outbound/**' }),
  'spec/**': to('repo:spec'),
  'scripts/**': to('repo:scripts'),
  'migrations/**': to('repo:migrations'),
  'test/system/**': to('repo:test:system'),
  'test/infra/**': to('repo:test:infra'),
  ...Object.fromEntries(
    libNames.flatMap((name) => [
      [`@acme-libs/${name}`, to('libs', { lib: [name] })],
      [`@acme-libs/contracts/${name}`, to('libs:contracts', { lib: [name] })],
    ]),
  ),
  ...Object.fromEntries(
    libLayers.map((layer) => [
      `@acme-libs/<lib>/${layer}`,
      to('libs', { ...own('lib'), file: `{${layer},*/${layer}}/**` }),
    ]),
  ),
  ...Object.fromEntries(
    libFolders.map((folder) => [
      `@acme-libs/<lib>/${folder}`,
      to('libs', { ...own('lib'), file: `${folder}/**` }),
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
