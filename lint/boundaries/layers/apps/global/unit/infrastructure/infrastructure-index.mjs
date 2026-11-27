export const appsGlobalUnitInfrastructureIndex = {
  category: 'apps:global:unit:infrastructure:index',
  pattern: 'apps/*/src/global/*/infrastructure/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/infrastructure/index',
    '@acme-<app>/global/<unit>/infrastructure/persistence',
    '@acme-<app>/global/<unit>/infrastructure/common-adapters',
    '@acme-<app>/global/<unit>/infrastructure/lib-adapters',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
