export const appsCommonModulesUnitOutboundTypesIndex = {
  category: 'apps:common:modules:unit:outbound:types:index',
  pattern: 'apps/*/src/common/modules/*/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
