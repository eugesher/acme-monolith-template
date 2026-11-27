export const appsFeaturesUnitInfrastructureCache = {
  category: 'apps:features:unit:infrastructure:cache',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/cache/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-<app>/features/<unit>/infrastructure/cache',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/cache',
    '@nestjs/common',
  ],
};
