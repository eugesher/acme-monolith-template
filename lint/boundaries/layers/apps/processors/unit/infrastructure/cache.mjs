export const appsProcessorsUnitInfrastructureCache = {
  category: 'apps:processors:unit:infrastructure:cache',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/cache/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/cache',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@acme-core/entities',
    '@acme-<app>/common/entities',

    '@acme-<app>/processors/<unit>/infrastructure/common-adapters',
    '@acme-<app>/processors/<unit>/infrastructure/config',
    '@acme-<app>/processors/<unit>/infrastructure/core-adapters',
    '@acme-<app>/processors/<unit>/infrastructure/index',
    '@acme-<app>/processors/<unit>/infrastructure/lib-adapters',
    '@acme-<app>/processors/<unit>/infrastructure/persistence',
    '@acme-<app>/processors/<unit>/infrastructure/queue',
    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
