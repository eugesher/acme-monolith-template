export const coreModulesUnitOutboundPorts = {
  category: 'core:modules:unit:outbound:ports',
  pattern: 'core/modules/src/*/outbound/ports/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
