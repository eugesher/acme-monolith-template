export const appsFeaturesUnitInfrastructureLibAdapters = {
  category: 'apps:features:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/credentials',
    '@acme-libs/contracts/health',
    '@nestjs/common',
  ],
};
