export const appsFeaturesUnitInfrastructureLibAdapters = {
  category: 'apps:features:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/credentials',
    '@acme-libs/contracts/health',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
