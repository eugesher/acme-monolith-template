export const appsGlobalUnitOutboundTypes = {
  category: 'apps:global:unit:outbound:types',
  pattern: 'apps/*/src/global/*/outbound/types/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
