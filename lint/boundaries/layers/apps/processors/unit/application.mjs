export const appsProcessorsUnitApplication = {
  category: 'apps:processors:unit:application',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/domain',
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-<app>/processors/<unit>/application',
    '@acme-core/domain',
    '@nestjs/common',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    'nestjs-pino',
  ],
};
