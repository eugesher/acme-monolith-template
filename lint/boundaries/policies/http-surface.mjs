import { packages } from './selectors.mjs';

const diNames = '{ClassProvider,DynamicModule,Inject,Injectable,Module}';

const entryNames = '{ClassProvider,DynamicModule,Inject,Injectable,Module,OnApplicationBootstrap}';

const rule = (categories, names, message) => ({
  from: { file: { categories: { anyOf: categories } } },
  allow: [{ ...packages('@nestjs/common'), dependency: { specifiers: [names] } }],
  disallow: [{ ...packages('@nestjs/common'), dependency: { specifiers: [`!${names}`] } }],
  message,
});

export const httpSurface = [
  rule(
    [
      'acme-app:common:modules:application',
      'acme-app:common:modules:infrastructure',
      'acme-app:common:modules:infrastructure:core-adapters',
      'acme-app:common:modules:infrastructure:common-adapters',
      'acme-app:common:modules:shell',
      'acme-app:common:modules:shell:facade',
      'acme-core:modules:application',
      'acme-core:modules:infrastructure',
      'acme-core:modules:infrastructure:core-adapters',
      'acme-core:modules:shell',
      'acme-core:modules:shell:facade',
      'acme-app:processors:application',
      'acme-app:processors:infrastructure',
      'acme-app:processors:infrastructure:core-adapters',
      'acme-app:processors:infrastructure:common-adapters',
      'acme-app:processors:infrastructure:lib-adapters',
      'acme-app:processors:infrastructure:queue',
      'acme-app:processors:module',
    ],
    diNames,
    `core and common modules and processors have no HTTP surface: they take only the DI names ${diNames} from @nestjs/common`,
  ),
  rule(
    ['acme-app:processors:presentation'],
    entryNames,
    `a processor has no HTTP surface: its presentation takes only the DI names and the start of the app ${entryNames} from @nestjs/common`,
  ),
];
