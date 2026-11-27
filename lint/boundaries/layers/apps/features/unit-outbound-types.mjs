export const appsFeaturesUnitOutboundTypes = {
  category: 'apps:features:unit:outbound:types',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
