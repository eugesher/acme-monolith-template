export const appsCommonModulesUnitOutboundTypesRecords = {
  category: 'apps:common:modules:unit:outbound:types:records',
  pattern: 'apps/*/src/common/modules/*/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-<app>/common/entities',
  ],
};
