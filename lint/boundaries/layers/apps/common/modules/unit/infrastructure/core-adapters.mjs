export const appsCommonModulesUnitInfrastructureCoreAdapters = {
  category: 'apps:common:modules:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/core-adapters/**',
  capture: ['app', 'unit', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
