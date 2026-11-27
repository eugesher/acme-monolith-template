export const appsProcessorsUnitInfrastructurePersistence = {
  category: 'apps:processors:unit:infrastructure:persistence',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/persistence/**',
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

    '@acme-<app>/processors/<unit>/outbound/**',

    '@acme-<app>/processors/<unit>/infrastructure/persistence',
  ],
};
