export const coreModulesUnitOutboundTypesEnums = {
  category: 'core:modules:unit:outbound:types:enums',
  pattern: 'core/modules/src/*/outbound/types/enums/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
