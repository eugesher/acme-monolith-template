export const appsGlobalUnitOutboundIndex = {
  category: 'apps:global:unit:outbound:index',
  pattern: 'apps/*/src/global/*/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
