export const appsProcessorsUnitOutboundTypesRecords = {
  category: 'apps:processors:unit:outbound:types:records',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
