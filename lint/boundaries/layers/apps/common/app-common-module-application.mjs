export default {
  category: 'acme-app:common:modules:application',
  pattern: 'apps/*/src/common/modules/*/application/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/common/modules/<module>/domain',
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-<app>/common/modules/<module>/application',
    '@acme-core/domain',
    '@acme-<app>/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    '@nestjs/common',
    'nestjs-pino',
  ],
};
