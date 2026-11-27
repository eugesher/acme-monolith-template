export const appsFeaturesUnitOutboundTypesRecords = {
  category: 'apps:features:unit:outbound:types:records',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/records/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
