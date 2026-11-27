export const appsGlobalUnitOutboundTypesIndex = {
  category: 'apps:global:unit:outbound:types:index',
  pattern: 'apps/*/src/global/*/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
