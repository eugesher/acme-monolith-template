export const appsGlobalUnitInfrastructureCommonAdapters = {
  category: 'apps:global:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/common-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts',

    '@acme-<app>/global/<unit>/outbound/**',

    '@acme-<app>/global/<unit>/infrastructure/common-adapters',
  ],
};
