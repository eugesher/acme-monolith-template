export const appsGlobalUnitOutboundTypesViews = {
  category: 'apps:global:unit:outbound:types:views',
  pattern: 'apps/*/src/global/*/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
