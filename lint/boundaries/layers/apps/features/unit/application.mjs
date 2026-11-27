export const appsFeaturesUnitApplication = {
  category: 'apps:features:unit:application',
  pattern: 'apps/*/src/features/{*,*/modules/*}/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'nestjs-pino',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',
    '@acme-core/domain',

    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/outbound/**',

    '@acme-<app>/features/<unit>/application',
  ],
};
