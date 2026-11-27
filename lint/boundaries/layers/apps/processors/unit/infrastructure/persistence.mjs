export const appsProcessorsUnitInfrastructurePersistence = {
  category: 'apps:processors:unit:infrastructure:persistence',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/persistence/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-<app>/processors/<unit>/infrastructure/persistence',
    '@acme-core/entities',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@nestjs/common',
    'typeorm',
  ],
};
