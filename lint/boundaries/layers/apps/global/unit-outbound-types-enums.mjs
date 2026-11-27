export const appsGlobalUnitOutboundTypesEnums = {
  category: 'apps:global:unit:outbound:types:enums',
  pattern: 'apps/*/src/global/*/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
