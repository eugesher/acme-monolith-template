export const appsGlobalUnitInfrastructureLibAdapters = {
  category: 'apps:global:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/lib-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/infrastructure/lib-adapters',
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/credentials',
    '@nestjs/common',
  ],
};
