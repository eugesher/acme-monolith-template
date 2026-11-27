export const appsFeaturesUnitInfrastructurePersistence = {
  category: 'apps:features:unit:infrastructure:persistence',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/persistence/**',
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

    '@acme-<app>/features/<unit>/outbound/**',

    '@acme-<app>/features/<unit>/infrastructure/persistence',
  ],
};
