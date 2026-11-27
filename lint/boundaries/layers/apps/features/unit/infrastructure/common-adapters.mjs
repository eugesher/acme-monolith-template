export const appsFeaturesUnitInfrastructureCommonAdapters = {
  category: 'apps:features:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
