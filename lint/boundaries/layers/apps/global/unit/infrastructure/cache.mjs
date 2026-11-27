export const appsGlobalUnitInfrastructureCache = {
  category: 'apps:global:unit:infrastructure:cache',
  pattern: 'apps/*/src/global/*/infrastructure/cache/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/database',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
    '@acme-<app>/contracts/<unit>',

    '@acme-<app>/global/<unit>/infrastructure/common-adapters',
    '@acme-<app>/global/<unit>/infrastructure/core-adapters',
    '@acme-<app>/global/<unit>/infrastructure/index',
    '@acme-<app>/global/<unit>/infrastructure/lib-adapters',
    '@acme-<app>/global/<unit>/infrastructure/persistence',
    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
