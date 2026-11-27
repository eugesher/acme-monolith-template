export const appsProcessorsUnitOutboundTypesViews = {
  category: 'apps:processors:unit:outbound:types:views',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
