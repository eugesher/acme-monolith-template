export const appsGlobalUnitOutboundTokens = {
  category: 'apps:global:unit:outbound:tokens',
  pattern: 'apps/*/src/global/*/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
