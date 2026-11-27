export const appsCommonModulesUnitInfrastructureCommonAdapters = {
  category: 'apps:common:modules:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/common-adapters/**',
  capture: ['app', 'unit', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
