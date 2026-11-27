export const appsCommonModulesUnitOutboundTypesQueries = {
  category: 'apps:common:modules:unit:outbound:types:queries',
  pattern: 'apps/*/src/common/modules/*/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/common/entities',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
