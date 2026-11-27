export default {
  category: 'acme-app:processors:application',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/application/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/processors/<module>/domain',
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-<app>/processors/<module>/application',
    '@acme-core/domain',
    '@nestjs/common',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    'nestjs-pino',
  ],
};
