export const appsCommonModulesUnitOutboundTypesIndex = {
  category: 'apps:common:modules:unit:outbound:types:index',
  pattern: 'apps/*/src/common/modules/*/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
