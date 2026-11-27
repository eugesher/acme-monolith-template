export const appsGlobalUnitOutboundTypesQueries = {
  category: 'apps:global:unit:outbound:types:queries',
  pattern: 'apps/*/src/global/*/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',
    '@acme-<app>/common/entities',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
