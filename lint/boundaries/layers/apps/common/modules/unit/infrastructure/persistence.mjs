export const appsCommonModulesUnitInfrastructurePersistence = {
  category: 'apps:common:modules:unit:infrastructure:persistence',
  pattern: 'apps/*/src/common/modules/*/infrastructure/persistence/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-<app>/common/modules/<unit>/infrastructure/persistence',
    '@acme-<app>/common/entities',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@nestjs/common',
    'typeorm',
  ],
};
