export const appsProcessorsUnitInfrastructureIndex = {
  category: 'apps:processors:unit:infrastructure:index',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/infrastructure/persistence',
    '@acme-<app>/processors/<unit>/infrastructure/core-adapters',
    '@acme-<app>/processors/<unit>/infrastructure/queue',
    '@acme-<app>/processors/<unit>/infrastructure/config',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
