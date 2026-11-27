export const appsFeaturesUnitInfrastructureCache = {
  category: 'apps:features:unit:infrastructure:cache',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/cache/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/cache',

    '@acme-<app>/features/<unit>/outbound/**',

    '@acme-<app>/features/<unit>/infrastructure/cache',
  ],
};
