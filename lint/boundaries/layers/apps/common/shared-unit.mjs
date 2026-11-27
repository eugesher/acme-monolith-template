export const appsCommonSharedUnit = {
  category: 'apps:common:shared:unit',
  pattern: 'apps/*/src/common/shared/*/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/shared/*/**',
    '@acme-<app>/contracts/<unit>',
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
