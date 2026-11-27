export const appsFeaturesUnitInfrastructureCoreAdapters = {
  category: 'apps:features:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
