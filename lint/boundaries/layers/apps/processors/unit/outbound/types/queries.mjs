export const appsProcessorsUnitOutboundTypesQueries = {
  category: 'apps:processors:unit:outbound:types:queries',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
