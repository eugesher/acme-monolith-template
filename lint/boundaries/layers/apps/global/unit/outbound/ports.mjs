export const appsGlobalUnitOutboundPorts = {
  category: 'apps:global:unit:outbound:ports',
  pattern: 'apps/*/src/global/*/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
