export const appsGlobalUnitOutboundTypesRecords = {
  category: 'apps:global:unit:outbound:types:records',
  pattern: 'apps/*/src/global/*/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
