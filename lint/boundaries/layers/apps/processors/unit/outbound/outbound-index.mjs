export const appsProcessorsUnitOutboundIndex = {
  category: 'apps:processors:unit:outbound:index',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
