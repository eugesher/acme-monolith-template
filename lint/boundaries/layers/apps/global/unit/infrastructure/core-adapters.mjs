export const appsGlobalUnitInfrastructureCoreAdapters = {
  category: 'apps:global:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/core-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
