export const appsCommonModulesUnitOutboundTypesRecords = {
  category: 'apps:common:modules:unit:outbound:types:records',
  pattern: 'apps/*/src/common/modules/*/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/common/entities',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
