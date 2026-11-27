export const appsCommonModulesUnitOutboundTypesEnums = {
  category: 'apps:common:modules:unit:outbound:types:enums',
  pattern: 'apps/*/src/common/modules/*/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
