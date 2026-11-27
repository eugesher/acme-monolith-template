export const appsCommonModulesUnitOutboundPorts = {
  category: 'apps:common:modules:unit:outbound:ports',
  pattern: 'apps/*/src/common/modules/*/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
