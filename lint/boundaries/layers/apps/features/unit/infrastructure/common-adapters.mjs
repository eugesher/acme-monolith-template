export const appsFeaturesUnitInfrastructureCommonAdapters = {
  category: 'apps:features:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
