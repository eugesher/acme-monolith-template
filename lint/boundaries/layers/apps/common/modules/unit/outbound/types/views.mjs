export const appsCommonModulesUnitOutboundTypesViews = {
  category: 'apps:common:modules:unit:outbound:types:views',
  pattern: 'apps/*/src/common/modules/*/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
