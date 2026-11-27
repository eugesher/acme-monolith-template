export const appsProcessorsUnitInfrastructureCoreAdapters = {
  category: 'apps:processors:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
