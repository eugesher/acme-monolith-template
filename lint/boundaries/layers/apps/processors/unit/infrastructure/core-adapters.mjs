export const appsProcessorsUnitInfrastructureCoreAdapters = {
  category: 'apps:processors:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
