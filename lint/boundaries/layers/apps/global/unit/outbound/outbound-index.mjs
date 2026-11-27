export const appsGlobalUnitOutboundIndex = {
  category: 'apps:global:unit:outbound:index',
  pattern: 'apps/*/src/global/*/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
