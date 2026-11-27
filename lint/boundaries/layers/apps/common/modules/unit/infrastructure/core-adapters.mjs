export const appsCommonModulesUnitInfrastructureCoreAdapters = {
  category: 'apps:common:modules:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/core-adapters/**',
  capture: ['app', 'unit', 'file'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
