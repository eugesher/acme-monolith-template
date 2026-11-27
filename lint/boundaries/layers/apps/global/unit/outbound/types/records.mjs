export const appsGlobalUnitOutboundTypesRecords = {
  category: 'apps:global:unit:outbound:types:records',
  pattern: 'apps/*/src/global/*/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
