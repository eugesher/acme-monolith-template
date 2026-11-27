export const appsCommonModulesUnitInfrastructurePersistence = {
  category: 'apps:common:modules:unit:infrastructure:persistence',
  pattern: 'apps/*/src/common/modules/*/infrastructure/persistence/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@acme-<app>/common/entities',

    '@acme-<app>/common/modules/<unit>/outbound/**',

    '@acme-<app>/common/modules/<unit>/infrastructure/persistence',
  ],
};
