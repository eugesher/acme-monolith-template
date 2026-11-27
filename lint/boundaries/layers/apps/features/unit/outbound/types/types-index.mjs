export const appsFeaturesUnitOutboundTypesIndex = {
  category: 'apps:features:unit:outbound:types:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
