export const appsGlobalUnitOutboundPorts = {
  category: 'apps:global:unit:outbound:ports',
  pattern: 'apps/*/src/global/*/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
