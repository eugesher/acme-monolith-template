export const appsGlobalUnitOutboundTypesQueries = {
  category: 'apps:global:unit:outbound:types:queries',
  pattern: 'apps/*/src/global/*/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
