export const appsCommonModulesUnitOutboundTypesCommands = {
  category: 'apps:common:modules:unit:outbound:types:commands',
  pattern: 'apps/*/src/common/modules/*/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
