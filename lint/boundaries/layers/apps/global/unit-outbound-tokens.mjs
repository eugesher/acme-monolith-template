export const appsGlobalUnitOutboundTokens = {
  category: 'apps:global:unit:outbound:tokens',
  pattern: 'apps/*/src/global/*/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
