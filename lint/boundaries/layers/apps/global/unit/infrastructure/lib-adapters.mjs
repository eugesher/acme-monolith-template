export const appsGlobalUnitInfrastructureLibAdapters = {
  category: 'apps:global:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/lib-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/credentials',

    '@acme-<app>/global/<unit>/outbound/**',

    '@acme-<app>/global/<unit>/infrastructure/lib-adapters',
  ],
};
