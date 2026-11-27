export const appsFeaturesUnitInfrastructureIndex = {
  category: 'apps:features:unit:infrastructure:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/infrastructure/cache',
    '@acme-<app>/features/<unit>/infrastructure/common-adapters',
    '@acme-<app>/features/<unit>/infrastructure/config',
    '@acme-<app>/features/<unit>/infrastructure/core-adapters',
    '@acme-<app>/features/<unit>/infrastructure/lib-adapters',
    '@acme-<app>/features/<unit>/infrastructure/persistence',
    '@acme-<app>/features/<unit>/infrastructure/queue',
  ],
};
