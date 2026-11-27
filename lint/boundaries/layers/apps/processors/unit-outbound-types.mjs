export const appsProcessorsUnitOutboundTypes = {
  category: 'apps:processors:unit:outbound:types',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
