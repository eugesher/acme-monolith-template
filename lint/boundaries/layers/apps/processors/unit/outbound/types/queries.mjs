export const appsProcessorsUnitOutboundTypesQueries = {
  category: 'apps:processors:unit:outbound:types:queries',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
