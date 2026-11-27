export const appsFeaturesUnitOutboundTypesIndex = {
  category: 'apps:features:unit:outbound:types:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
