export const appsProcessorsUnitInfrastructureLibAdapters = {
  category: 'apps:processors:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
