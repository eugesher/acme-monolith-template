export const appsProcessorsUnitApplication = {
  category: 'apps:processors:unit:application',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'nestjs-pino',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/domain',
    '@acme-<app>/processors/<unit>/outbound/**',

    '@acme-<app>/processors/<unit>/application',
  ],
};
