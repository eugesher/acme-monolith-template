export const appsGlobalUnitInfrastructurePersistence = {
  category: 'apps:global:unit:infrastructure:persistence',
  pattern: 'apps/*/src/global/*/infrastructure/persistence/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/infrastructure/persistence',
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-core/entities',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/database',
    '@nestjs/common',
    'typeorm',
  ],
};
