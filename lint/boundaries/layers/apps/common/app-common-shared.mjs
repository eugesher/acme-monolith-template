export default {
  category: 'acme-app:common:shared',
  pattern: 'apps/*/src/common/shared/*/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/common/shared/*/**',
    '@acme-<app>/contracts/<module>',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/http',
    '@acme-libs/observability',
    '@acme-libs/contracts/cache',
    '@nestjs/common',
    'nestjs-pino',
  ],
};
