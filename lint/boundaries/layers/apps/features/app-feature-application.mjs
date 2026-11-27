export default {
  category: 'acme-app:features:application',
  pattern: 'apps/*/src/features/{*,*/modules/*}/application/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/features/<module>/domain',
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-<app>/features/<module>/application',
    '@acme-core/domain',
    '@nestjs/common',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    'nestjs-pino',
  ],
};
