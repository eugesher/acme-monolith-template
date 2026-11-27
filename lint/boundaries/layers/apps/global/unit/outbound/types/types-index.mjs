export const appsGlobalUnitOutboundTypesIndex = {
  category: 'apps:global:unit:outbound:types:index',
  pattern: 'apps/*/src/global/*/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
