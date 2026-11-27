export const appsFeaturesUnitOutboundTypesEnums = {
  category: 'apps:features:unit:outbound:types:enums',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
