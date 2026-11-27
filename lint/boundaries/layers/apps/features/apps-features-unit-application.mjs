export default {
  category: 'apps:features:unit:application',
  pattern: 'apps/*/src/features/{*,*/modules/*}/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-<app>/features/<unit>/application',
    '@acme-core/domain',
    '@nestjs/common',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    'nestjs-pino',
  ],
};
