export const appsProcessorsUnitInfrastructureCommonAdapters = {
  category: 'apps:processors:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
