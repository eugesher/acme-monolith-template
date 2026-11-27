export const coreModulesUnitOutboundPorts = {
  category: 'core:modules:unit:outbound:ports',
  pattern: 'core/modules/src/*/outbound/ports/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
