export const appsCommonModulesUnitInfrastructureCommonAdapters = {
  category: 'apps:common:modules:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/common-adapters/**',
  capture: ['app', 'unit', 'file'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
