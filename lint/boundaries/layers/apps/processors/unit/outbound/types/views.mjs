export const appsProcessorsUnitOutboundTypesViews = {
  category: 'apps:processors:unit:outbound:types:views',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
