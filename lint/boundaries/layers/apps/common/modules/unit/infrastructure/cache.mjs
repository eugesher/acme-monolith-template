export const appsCommonModulesUnitInfrastructureCache = {
  category: 'apps:common:modules:unit:infrastructure:cache',
  pattern: 'apps/*/src/common/modules/*/infrastructure/cache/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@acme-core/entities',
    '@acme-<app>/common/entities',

    '@acme-<app>/common/modules/<unit>/infrastructure/common-adapters',
    '@acme-<app>/common/modules/<unit>/infrastructure/core-adapters',
    '@acme-<app>/common/modules/<unit>/infrastructure/index',
    '@acme-<app>/common/modules/<unit>/infrastructure/persistence',
    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
