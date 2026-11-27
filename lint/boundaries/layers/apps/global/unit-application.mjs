export const appsGlobalUnitApplication = {
  category: 'apps:global:unit:application',
  pattern: 'apps/*/src/global/*/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/application',
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
