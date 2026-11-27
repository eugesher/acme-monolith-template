export const appsCommonModulesUnitOutboundTypesEnums = {
  category: 'apps:common:modules:unit:outbound:types:enums',
  pattern: 'apps/*/src/common/modules/*/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
