export const appsFeaturesUnitOutboundTypesQueries = {
  category: 'apps:features:unit:outbound:types:queries',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',
    '@acme-<app>/common/entities',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
