export const appsFeaturesUnitOutboundTypesRecords = {
  category: 'apps:features:unit:outbound:types:records',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/records/**',
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
