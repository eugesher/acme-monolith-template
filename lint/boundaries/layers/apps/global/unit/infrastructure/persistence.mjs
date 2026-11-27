export const appsGlobalUnitInfrastructurePersistence = {
  category: 'apps:global:unit:infrastructure:persistence',
  pattern: 'apps/*/src/global/*/infrastructure/persistence/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/database',
    '@acme-core/entities',

    '@acme-<app>/global/<unit>/outbound/**',

    '@acme-<app>/global/<unit>/infrastructure/persistence',
  ],
};
