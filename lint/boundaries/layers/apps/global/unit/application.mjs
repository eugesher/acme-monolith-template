export const appsGlobalUnitApplication = {
  category: 'apps:global:unit:application',
  pattern: 'apps/*/src/global/*/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',

    '@acme-<app>/global/<unit>/application',
  ],
};
