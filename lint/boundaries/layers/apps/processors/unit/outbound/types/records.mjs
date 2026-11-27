export const appsProcessorsUnitOutboundTypesRecords = {
  category: 'apps:processors:unit:outbound:types:records',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
