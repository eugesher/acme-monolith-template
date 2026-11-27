export const coreModulesUnitOutboundTypesCommands = {
  category: 'core:modules:unit:outbound:types:commands',
  pattern: 'core/modules/src/*/outbound/types/commands/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
