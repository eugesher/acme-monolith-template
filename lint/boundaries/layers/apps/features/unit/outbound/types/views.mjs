export const appsFeaturesUnitOutboundTypesViews = {
  category: 'apps:features:unit:outbound:types:views',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
